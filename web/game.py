"""Imports: The script imports necessary modules, including Flask, SQLAlchemy, and Flask-SocketIO.
Blueprint: game is defined as a Flask blueprint for routing.
Game ID Generation: generate_game_id creates a unique ID for each game.
Routes:
new_game: Creates a new game with optional AI bots and players.
check_game: Checks the status of a game.
invite_player: Invites another player to join a game.
start_replay: Starts a game replay from saved history.
start_campaign: Starts a campaign game.
Error Handling: handle_database_error logs database errors and disconnects the user. handle_flask_error applies this handler to SQLAlchemy errors.
Initialization: initialize sets up the game tick process, which periodically updates game states and emits events using WebSocket.
The script is structured to manage multiplayer game states efficiently, handle player invitations, and support both standard and campaign game modes.
"""

import datetime
import json
import random
import string
import sys
import time
import traceback
import uuid

import eventlet
from flask import Blueprint, request, jsonify
from flask_login import current_user
from sqlalchemy.exc import SQLAlchemyError
from flask_socketio import disconnect

import context
from db import db_service
from lib import ai, campaign, elo
from lib.board import Board
from lib.game import Game, GameState, Speed
from lib.replay import Replay
from web import game_states

TICK_PERIOD = 0.1
DEFAULT_RATING = 1200

game = Blueprint("game", __name__)

socketio = None  # populated by initialize()


def generate_game_id():
    return "".join(
        random.choice(string.ascii_uppercase + string.digits) for _ in range(6)
    )


@game.route("/api/game/new", methods=["POST"])
def new_game():
    data = request.get_json()
    speed = data["speed"]
    bots = {
        int(player): ai.get_bot(difficulty)
        for player, difficulty in data.get("bots", {}).items()
    }
    username = data.get("username")
    print("new game", data)

    game_id = generate_game_id()
    player_keys = {i: str(uuid.uuid4()) for i in range(1, 3) if i not in bots}

    players = {i: f"b:{bot.difficulty}" for i, bot in bots.items()}
    if current_user.is_authenticated:
        players[1] = f"u:{current_user.user_id}"
        user = db_service.get_user_by_id(current_user.user_id)
        if user.current_game:
            return jsonify(success=False, message="User already in game.")

        db_service.update_user_current_game(
            current_user.user_id, game_id, player_keys[1]
        )

    if username:
        user = db_service.get_user_by_username(username)
        if user is None or user.current_game:
            return jsonify(
                success=False,
                message="User to invite does not exist or is already in a game.",
            )

        players[2] = f"u:{user.user_id}"
        db_service.update_user_current_game(user.user_id, game_id, player_keys[2])
        socketio.emit("invite", "", room=user.user_id)

    for i in range(1, 3):
        if i not in players:
            players[i] = "o"

    game_instance = Game(Speed(speed), players)
    for player in bots:
        game_instance.mark_ready(player)

    game_states[game_id] = GameState(game_id, game_instance, player_keys, bots)

    return jsonify(success=True, gameId=game_id, playerKeys=player_keys)


@game.route("/api/game/check", methods=["GET"])
def check_game():
    game_id = request.args.get("gameId")
    print("check", request.args)

    if not current_user.is_authenticated:
        return jsonify(success=False, message="User is not logged in.")

    if game_id in game_states:
        return jsonify(success=True)

    db_service.update_user_current_game(current_user.user_id, None, None)
    user = db_service.get_user_by_id(current_user.user_id)

    return jsonify(success=False, user=user.to_json_obj())


@game.route("/api/game/invite", methods=["POST"])
def invite_player():
    data = request.get_json()
    game_id = data["gameId"]
    player = data["player"]
    username = data["username"]
    print("invite", data)

    if not current_user.is_authenticated:
        return jsonify(success=False, message="User is not logged in.")

    if game_id not in game_states:
        return jsonify(success=False, message="Game does not exist.")

    game_state = game_states[game_id]
    game = game_state.game
    if game.players[player] != "o":
        return jsonify(success=False, message="Player position is already filled.")

    if f"u:{current_user.user_id}" not in game.players.values():
        return jsonify(success=False, message="User is not in the game.")

    user = db_service.get_user_by_username(username)
    if user is None or user.current_game:
        return jsonify(
            success=False,
            message="User to invite does not exist or is already in a game.",
        )

    new_key = str(uuid.uuid4())
    game_state.player_keys[player] = new_key
    game.players[player] = f"u:{user.user_id}"
    db_service.update_user_current_game(user.user_id, game_id, new_key)

    socketio.emit("invite", "", room=str(user.user_id))

    socketio.emit(
        "inviteack",
        {"game": game.to_json_obj()},
        room=game_id,
        json=True,
    )

    return jsonify(success=True)


@game.route("/api/game/startreplay", methods=["POST"])
def start_replay():
    data = request.get_json()
    history_id = data["historyId"]
    print("replay start", data)

    game_history = db_service.get_game_history(history_id)
    if game_history is None:
        return jsonify(success=False, message="Replay does not exist.")

    replay = Replay.from_json_obj(game_history.replay)
    if replay.players[2].startswith("c"):
        level = int(replay.players[2][2:])
        campaign_level = campaign.get_level(level)
        game = Game(
            Speed(replay.speed),
            replay.players,
            board=Board.from_str(campaign_level.board),
            is_campaign=True,
        )
    else:
        game = Game(Speed(replay.speed), replay.players)
    for player in replay.players:
        game.mark_ready(player)

    game_id = generate_game_id()
    game_states[game_id] = GameState(game_id, game, {}, {}, replay)

    return jsonify(success=True, gameId=game_id)


@game.route("/api/game/startcampaign", methods=["POST"])
def start_campaign():
    data = request.get_json()
    level = data["level"]
    print("campaign start", data)

    if not current_user.is_authenticated:
        return jsonify(success=False, message="User is not logged in.")

    user_id = current_user.user_id
    user = db_service.get_user_by_id(user_id)
    if user.current_game:
        game_id = user.current_game["gameId"]
        if game_id in game_states:
            game_state = game_states[game_id]
            if not game_state.game.started or game_state.game.finished:
                del game_states[game_id]
            else:
                return jsonify(success=False, message="User already in game.")

    progress = db_service.get_campaign_progress(user_id)
    belt = level // 8 + 1
    if belt > 1 and not progress.belts_completed.get(str(belt - 1)):
        return jsonify(
            success=False, message="User does not have access to this level."
        )

    campaign_level = campaign.get_level(level)
    players = {1: f"u:{user_id}", 2: f"c:{level}"}
    game = Game(
        Speed(campaign_level.speed),
        players,
        board=Board.from_str(campaign_level.board),
        is_campaign=True,
    )
    game.mark_ready(2)

    game_id = generate_game_id()
    player_keys = {1: str(uuid.uuid4())}
    bots = {2: ai.get_bot("campaign")}
    game_states[game_id] = GameState(game_id, game, player_keys, bots, level=level)

    db_service.update_user_current_game(user_id, game_id, player_keys[1])

    return jsonify(success=True, gameId=game_id, playerKeys=player_keys)


def handle_database_error(e):
    print("Database Error:", str(e))
    disconnect()


@game.errorhandler(SQLAlchemyError)
def handle_flask_error(e):
    handle_database_error(e)


def initialize(init_socketio):
    global socketio
    socketio = init_socketio

    def tick():
        start = time.time()
        tick_number = 0
        while True:
            try:
                tick_number += 1
                next_tick = start + TICK_PERIOD * tick_number
                sleep_amount = next_tick - time.time()
                if sleep_amount > 0:
                    eventlet.sleep(sleep_amount)

                if tick_number % 600 == 0:
                    print("game tick", tick_number)
                    sys.stdout.flush()

                randnum = random.randint(0, 9999)

                current_time = time.time()
                expired_games = set()
                for game_id, game_state in list(game_states.items()):
                    game = game_state.game

                    if tick_number % 600 == 0:
                        print(
                            "game status",
                            game_id,
                            game.current_tick,
                            game.players,
                            game.finished,
                        )

                    if current_time - game.last_tick_time > 60 * 10:
                        expired_games.add(game_id)
                        continue

                    if not game.started or game.finished:
                        continue

                    moved = False

                    try:
                        if game.current_tick == 0 and game_state.replay is None:
                            db_service.add_active_game(
                                context.SERVER,
                                game_id,
                                {
                                    "players": game.players,
                                    "speed": game.speed.value,
                                    "startTime": str(datetime.datetime.utcnow()),
                                },
                            )
                    except SQLAlchemyError as e:
                        handle_database_error(e)
                        traceback.print_exc()
                        continue

                    try:
                        if game.current_tick >= 10:
                            for player, bot in game_state.bots.items():
                                if game.current_tick == 10:
                                    game.log(
                                        f"bot {player} {bot.difficulty} is playing"
                                    )
                                moves = bot.get_moves(
                                    game, player, game_state.random_seeds[player]
                                )
                                for move in moves:
                                    game.queue_move(player, move)
                                if moves:
                                    moved = True
                    except Exception as e:
                        print("bot move error", e)
                        traceback.print_exc()
                        continue

                    try:
                        if game_state.replay:
                            moves = game_state.replay.get_moves(game.current_tick)
                            for player, move in moves:
                                game.queue_move(player, move)
                            if moves:
                                moved = True
                    except Exception as e:
                        print("replay move error", e)
                        traceback.print_exc()
                        continue

                    try:
                        if game.maybe_tick(randnum):
                            moved = True
                    except Exception as e:
                        print("game tick error", e)
                        traceback.print_exc()
                        continue

                    try:
                        if moved:
                            socketio.emit(
                                "tick",
                                {"events": game.get_new_events()},
                                room=game_id,
                                json=True,
                            )
                    except Exception as e:
                        print("emit tick error", e)
                        traceback.print_exc()
                        continue

                    try:
                        if game.finished:
                            db_service.update_active_game(
                                context.SERVER,
                                game_id,
                                {"endTime": str(datetime.datetime.utcnow())},
                            )
                            for player, player_key in game_state.player_keys.items():
                                if player_key is None:
                                    continue
                                player_id = game.get_user_id(player)
                                if player_id is None:
                                    continue
                                db_service.update_user_current_game(
                                    player_id, None, None
                                )
                            db_service.finish_game(game_id)
                            if game_state.level:
                                winner = game.get_winner()
                                if winner == 1:
                                    db_service.set_campaign_progress_belt(
                                        game_state.level, current_user.user_id
                                    )
                    except SQLAlchemyError as e:
                        handle_database_error(e)
                        traceback.print_exc()
                        continue

                for game_id in expired_games:
                    try:
                        db_service.remove_active_game(context.SERVER, game_id)
                        game_state = game_states.pop(game_id)
                        for player, player_key in game_state.player_keys.items():
                            if player_key is None:
                                continue
                            player_id = game_state.game.get_user_id(player)
                            if player_id is None:
                                continue
                            db_service.update_user_current_game(player_id, None, None)
                    except SQLAlchemyError as e:
                        handle_database_error(e)
                        traceback.print_exc()
                        continue

            except Exception as e:
                print("Game tick error:", str(e))
                traceback.print_exc()
                eventlet.sleep(TICK_PERIOD)

    eventlet.spawn(tick)
