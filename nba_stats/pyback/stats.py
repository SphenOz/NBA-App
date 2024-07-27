from flask import abort, jsonify, redirect, request, url_for
from flask_login import current_user, login_required, login_user
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from nbaAPI import search_player, search_team, get_players
import sqlalchemy as sa
import json
import datetime
import numpy as np
from nba_api.stats.endpoints import playercareerstats
from nba_api.stats.static import players
from __init__ import create_app,db,jwt
from models import User

app = create_app()
player_dict = players.get_active_players()
userinput = "a"
app.app_context().push()
db.create_all()
#updateJson()

@app.route("/api/home/<username>", methods=['GET'])
@jwt_required()
def home(username):
    current_user = get_jwt_identity()
    print("Current: ", current_user)
    thisUser = db.session.scalar(sa.select(User).where(User.username == username))
    if thisUser is None:
        abort(404, "invalid user")
    print(thisUser.username)
    print("team: ", thisUser.team)
    if(thisUser.team):
        return thisUser.team
    return ""

@app.route('/api/username', methods=['GET'])
@jwt_required()
def get_username():
    token = request.headers.get('Authorization').split(" ")[1]
    print("TOKEN: ", token)
    username = get_jwt_identity()
    print("returning username: ", username)
    return username


@app.route("/api/login", methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        uName = request.args.get('username')
        user = db.session.scalar(
            sa.select(User).where(User.username == uName)
        )
        if user is None or not user.check_password(request.args.get('password')):
            print("INVALID")
            abort(400, "User not present")
        print(user.username)
        login_user(user, False)
        print(datetime.datetime.now())
        time = datetime.timedelta(days=1)
        token = create_access_token(identity=user.username, expires_delta=time)
        return jsonify({"token": token})
    else:
        return "oops"

@app.route("/api/signup", methods=['GET', 'POST'])
def signup():
    if current_user.is_authenticated:
        return "Gods blunder"
    if request.method == 'POST':
        user = User(username=request.args.get('username'))
        user.set_password(request.args.get('password'))
        db.session.add(user)
        db.session.commit()
        print("REGISTERED A USER")
        return "Gods blunder"
    return "failed"

@app.route("/api/set_team", methods=['POST', 'PUT'])
@jwt_required()
def set_team():
    token = request.headers.get('Authorization').split(" ")[1]
    current_user = get_jwt_identity()
    if(request.method == 'POST'):
        team = request.args.get('team')
        team = search_team(team) 
        print(team)
        user = db.session.scalar(
            sa.select(User).where(User.username == current_user)
        )
        user.set_team(team)
        print("For user.. ", user.username)
        print("Setting team...", user.team)
        db.session.commit()
        return team
    if(request.method =='PUT'):
        team = ''
        user = db.session.scalar(
            sa.select(User).where(User.username==current_user)
        )
        user.set_team(team)
        db.session.commit()
        print("confirmed")
        return team
    return "error"
    
    

@app.route("/api/stats", methods=['GET'])
def get_player(user_input = "lebron james", season = -1):
    print('method: GET, route: /api/stats, nba_api method: search_player')
    if(request.method == 'GET'):
        user_input=request.args.get('name')
        # season = int(request.args.get('season'))
    lowered = user_input
    print(lowered)
    try:
        return search_player(lowered)
    except:
        raise IndexError

@app.route("/api/playersOfTeam", methods=['GET'])
def getPlayers(teamToSearch = "default"):
    if(request.method == 'GET'):
        teamToSearch=request.args.get('team')
    try:
        listOfPlayers = get_players(teamToSearch)
        return listOfPlayers
    except IndexError:
        raise IndexError("Player Not Found")

def np_encoder(object):
    if isinstance(object, np.generic):
        return object.item()

    
if __name__ == "__main__":
    app.run(debug=True,port=8080)

# player_dict = players.get_active_players()
# app = Flask(__name__)

# @app.route("/api/stats", methods=['GET'])
# def get_player(user_input = "lebron james", season = -1):
#     lowered = user_input.lower()
#     try:
#         player = [player for player in player_dict if player['full_name'].lower() == lowered][0]
#         playerid = str(player['id'])
#         playerstats = playercareerstats.PlayerCareerStats(player_id=playerid)
#         playerdf = playerstats.get_data_frames()[0]
#         test = playerstats.get_json()
#         test = json.loads(test)
        
#         if(season!= -1):
#             playerInfo = playerdf.loc[season][['SEASON_ID','TEAM_ABBREVIATION','GP','FG_PCT', 'FG3_PCT','FT_PCT','PTS','REB','AST','STL','BLK','TOV','PLAYER_ID']]
#             return playerInfo.tolist()
#         playerInfo = playerdf.loc[playerdf.shape[0]-1][['SEASON_ID','TEAM_ABBREVIATION','GP','FG_PCT', 'FG3_PCT','FT_PCT','PTS','REB','AST','STL','BLK','TOV','PLAYER_ID']]
#         playerInfo = playerInfo.tolist()
#         playerInfo.append(playerdf.shape[0])
#         return json.dumps(playerInfo, default=np_encoder)
#     except IndexError:
#         raise IndexError("Player Not Found")

# def np_encoder(object):
#     if isinstance(object, np.generic):
#         return object.item()