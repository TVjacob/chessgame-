import json
import random
import requests
import string
import traceback
import uuid
import bcrypt
import argon2

from flask import Blueprint, request, redirect, session, url_for
from flask_login import current_user, login_user, logout_user
from db.models import User
from flask_oauthlib.client import OAuth
from sqlalchemy.exc import IntegrityError

import config
from db import db_service, s3


ANIMALS = ["Tiger", "Leopard", "Crane", "Snake", "Dragon"]
CHESS_PIECES = ["Pawn", "Knight", "Bishop", "Rook", "Queen", "King"]

PROFILE_PIC_SIZE_LIMIT = 1024 * 64

# oauth = OAuth()
# google = oauth.remote_app(
#     'google',
#     base_url='https://www.google.com/accounts/',
#     authorize_url='https://accounts.google.com/o/oauth2/auth',
#     request_token_url=None,
#     request_token_params={
#         'scope': 'email',
#         'response_type': 'code',
#     },
#     access_token_url='https://accounts.google.com/o/oauth2/token',
#     access_token_method='POST',
#     access_token_params={'grant_type': 'authorization_code'},
#     consumer_key=config.GOOGLE_CLIENT_ID,
#     consumer_secret=config.GOOGLE_CLIENT_SECRET
# )

user = Blueprint("user", __name__)


# @user.route('/login', methods=['GET'])
# def login():
#     next_url = request.args.get('next') or url_for('index')
#     print('login', request.args)

#     if current_user.is_authenticated:
#         return redirect(next_url)

#     callback = url_for('user.authorized', _external=True)
#     google.request_token_params['state'] = next_url
#     return google.authorize(callback=callback)


# @user.route('/api/user/oauth2callback', methods=['GET'])
# @google.authorized_handler
# def authorized(data):
#     next_url = request.args.get('state') or url_for('index')
#     print('oauth authorized', request.args)

#     if current_user.is_authenticated:
#         return redirect(next_url)

#     # store access token in the session
#     access_token = data['access_token']
#     session['access_token'] = access_token, ''

#     # get user's email from google
#     headers = {'Authorization': 'OAuth ' + access_token}
#     response = requests.get('https://www.googleapis.com/plus/v1/people/me', headers=headers)
#     if response.status_code == 200:
#         user_data = response.json()

#         print('user data', user_data)

#         email = [e for e in user_data['emails'] if e['type'] == 'ACCOUNT'][0]['value']
#         user = db_service.get_user_by_email(email)
#         if user is None:
#             # create user with random username
#             username = random_username()
#             while db_service.get_user_by_username(username) is not None:
#                 username = random_username()

#             user = db_service.create_user(email, username, None, {})

#         login_user(user)
#     else:
#         print('error getting google info', response.status_code, response.text)

#     return redirect(next_url)


# @user.route('/logout', methods=['POST'])
# def logout():
#     print('logout', current_user)

#     logout_user()

#     csrf_token = generate_csrf_token()


#     return json.dumps({
#         'loggedIn': False,
#         'csrfToken': csrf_token,
#     })
@user.route("/api/user/signup", methods=["POST"])
def signup():
    data = json.loads(request.data)
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return json.dumps(
            {"success": False, "message": "Email and password are required."}
        )

    try:
        # Check if the email already exists
        existing_user = db_service.get_user_by_email(email)
        if existing_user:
            return json.dumps({"success": False, "message": "Email already exists."})

        # Hash the password
        hashed_password = hash_password(password)

        # Generate a random username
        username = random_username()
        picture_url = ""
        ratings = 1
        # Set default values for picture_url, ratings, and current_game
        picture_url = (
            picture_url if picture_url != "" else ""
        )  # Provide a default picture URL if needed
        ratings = ratings if ratings != {} else {}  # Provide default ratings if needed
        current_game = None  # No current game upon signup

        # Create a new user
        user = db_service.create_user(
            email, username, picture_url, ratings, hashed_password, current_game
        )

        return json.dumps({"success": True, "message": "User created successfully."})

    except Exception as e:
        traceback.print_exc()
        return json.dumps(
            {"success": False, "message": "An error occurred while creating the user."}
        )


def set_password(password):
    print("password ...", password)
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), salt)
    new_password = f"{salt.decode('utf-8')}${hashed_password.decode('utf-8')}"
    return new_password


@user.route("/api/user/login", methods=["POST"])
def login():
    # try:
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return (
            json.dumps(
                {"success": False, "message": "Email and password are required."}
            ),
            400,
        )

    user = db_service.get_user_by_email(email)

    if not user:
        return (
            json.dumps({"success": False, "message": "Invalid email or password."}),
            401,
        )

    # Debugging output
    print(f"Stored password hash: {user.password}")

    if not verify_password(user.password, password):
        return (
            json.dumps({"success": False, "message": "Invalid email or password."}),
            401,
        )

    login_user(user)
    return (
        json.dumps(
            {
                "success": True,
                "message": "User logged in successfully.",
                "user": user.to_json_obj(),
            }
        ),
        200,
    )


# # except Exception as e:
#     print(f"Error: {e}")
#     return (
#         json.dumps(
#             {"success": False, "message": "An error occurred during login."}
#         ),
#         500,
#     )


# Other routes and functions remain unchanged...
def hash_password(password):
    hasher = argon2.PasswordHasher()
    return hasher.hash(password)


def verify_password(hashed_password, password):
    print(hashed_password, " :hashed_password")
    hasher = argon2.PasswordHasher()
    try:
        hasher.verify(hashed_password, password)
        return True
    except:
        return False


@user.route("/api/user/info", methods=["GET"])
def info():
    user_ids = request.args.getlist("userId")
    print("user info", user_ids)
    if not user_ids:
        csrf_token = generate_csrf_token()
        print(session, "0000d0d0d0d0d")
        print(session["_csrf_token"], "_________")
        # look up my info
        if not current_user.is_authenticated:
            return json.dumps(
                {
                    "loggedIn": False,
                    "csrfToken": csrf_token,
                }
            )

        return json.dumps(
            {
                "loggedIn": True,
                "csrfToken": csrf_token,
                "user": current_user.to_json_obj(with_key=True),
            }
        )

    # look up other user info
    users = db_service.get_users_by_id(user_ids)
    return json.dumps(
        {
            "users": {user_id: user.to_json_obj() for user_id, user in users.items()},
        }
    )


@user.route("/api/user/update", methods=["POST"])
def update():
    data = json.loads(request.data)
    print("user update", data)

    if not current_user.is_authenticated:
        return json.dumps(
            {
                "success": False,
                "message": "User is not logged in.",
            }
        )

    user_id = current_user.user_id
    user = db_service.get_user_by_id(user_id)
    if user is None:
        return json.dumps(
            {
                "success": False,
                "message": "User does not exist.",
            }
        )

    user.username = data.get("username", user.username)

    if len(user.username) < 3:
        return json.dumps(
            {
                "success": False,
                "message": "Username too short.",
            }
        )
    elif len(user.username) > 24:
        return json.dumps(
            {
                "success": False,
                "message": "Username too long.",
            }
        )

    try:
        db_service.update_user(user_id, user.username, user.picture_url)
        user = db_service.get_user_by_id(user_id)
        response = {
            "success": True,
            "user": user.to_json_obj(),
        }
    except IntegrityError:
        response = {
            "success": False,
            "message": "Username already taken.",
        }

    return json.dumps(response)


@user.route("/api/user/uploadPic", methods=["POST"])
def upload_pic():
    file_bytes = request.data
    print("upload pic", len(file_bytes))

    if not current_user.is_authenticated:
        return json.dumps(
            {
                "success": False,
                "message": "User is not logged in.",
            }
        )

    user_id = current_user.user_id
    user = db_service.get_user_by_id(user_id)
    if user is None:
        return json.dumps(
            {
                "success": False,
                "message": "User does not exist.",
            }
        )

    if len(file_bytes) > PROFILE_PIC_SIZE_LIMIT:
        return json.dumps(
            {
                "success": False,
                "message": "File is too large (max size 64KB).",
            }
        )

    try:
        key = "profile-pics/" + str(uuid.uuid4())
        s3.upload_data("com-kfchess-public", key, file_bytes, ACL="public-read")
        url = s3.get_public_url("com-kfchess-public", key)
        print("s3 upload", key, url)

        db_service.update_user(user_id, user.username, url)
        user = db_service.get_user_by_id(user_id)
        response = {
            "success": True,
            "user": user.to_json_obj(),
        }
    except:
        traceback.print_exc()
        response = {
            "success": False,
            "message": "Failed to upload profile picture.",
        }

    return json.dumps(response)


@user.route("/api/user/history", methods=["GET"])
def history():
    user_id = int(request.args["userId"])
    offset = int(request.args["offset"])
    count = int(request.args["count"])
    print("history", request.args)

    history = db_service.get_user_game_history(user_id, offset, count)

    # fetch user info for all opponents in history
    user_ids = set()
    for h in history:
        for value in h.game_info["opponents"]:
            if value.startswith("u:"):
                user_ids.add(int(value[2:]))

    if user_ids:
        users = db_service.get_users_by_id(list(user_ids))
    else:
        users = {}

    return json.dumps(
        {
            "history": [h.to_json_obj() for h in history],
            "users": {user_id: user.to_json_obj() for user_id, user in users.items()},
        }
    )


@user.route("/api/user/campaign", methods=["GET"])
def campaign():
    user_id = int(request.args["userId"])
    print("campaign")

    progress = db_service.get_campaign_progress(user_id)
    return json.dumps(
        {
            "progress": progress.to_json_obj(),
        }
    )


def random_username():
    return (
        random.choice(ANIMALS)
        + " "
        + random.choice(CHESS_PIECES)
        + " "
        + str(random.randint(100, 999))
    )


def generate_csrf_token():
    if "_csrf_token" not in session:
        session["_csrf_token"] = "".join(
            random.choice(string.ascii_uppercase + string.digits) for i in range(24)
        )
    return session["_csrf_token"]
