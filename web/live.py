# import datetime
# import json

# from flask import Blueprint, request

# from db import db_service


# live = Blueprint('live', __name__)


# @live.route('/api/live', methods=['GET'])
# def live_games():
#     active_games = db_service.get_all_active_games()

#     # fetch user info for all players in active games
#     user_ids = set()
#     for game in active_games:
#         for value in game.game_info['players'].itervalues():
#             if value.startswith('u:'):
#                 user_ids.add(int(value[2:]))

#     if user_ids:
#         users = db_service.get_users_by_id(list(user_ids))
#     else:
#         users = {}

#     return json.dumps({
#         'games': [
#             g.to_json_obj() for g in active_games
#         ],
#         'users': {
#             user_id: user.to_json_obj()
#             for user_id, user in users.items()
#         },
#     })
import datetime
import json

from flask import Blueprint, request

from db import db_service


live = Blueprint("live", __name__)


@live.route("/api/live", methods=["GET"])
def live_games():
    try:
        # Fetch all active games
        active_games = db_service.get_all_active_games()

        # Fetch user info for all players in active games
        user_ids = set()
        for game in active_games:
            for value in game.game_info["players"].values():
                if value.startswith("u:"):
                    user_ids.add(int(value[2:]))

        # Fetch user information in a single query
        if user_ids:
            users = db_service.get_users_by_id(list(user_ids))
        else:
            users = {}

        # Serialize data and return response
        response_data = {
            "games": [g.to_json_obj() for g in active_games],
            "users": {user_id: user.to_json_obj() for user_id, user in users.items()},
        }
        return json.dumps(response_data)

    except Exception as e:
        # Handle exceptions gracefully
        error_message = "An error occurred while fetching live games: {}".format(str(e))
        return json.dumps({"error": error_message}), 500
