from flask import jsonify, redirect, request, url_for
from flask_login import current_user, login_required, login_user
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from nbaAPI import search_player
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
season = -1
tTeam = 'placeholder'
app.app_context().push()
db.create_all()

@app.route("/api/home/<username>", methods=['GET'])
@jwt_required()
def home(username):
    current_user = get_jwt_identity()
    user = db.first_or_404(sa.select(User).where(User.username == username))
    return user.team

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
            return("INVALID")
        print(user.username)
        login_user(user, False)
        print(datetime.datetime.now())
        time = datetime.timedelta(seconds=30)
        token = create_access_token(identity=user.username, expires_delta=time)
        return jsonify({"token": token})
    else:
        return "oops"

@app.route("/api/signup", methods=['GET', 'POST'])
def signup():
    if current_user.is_authenticated:
        return "Gods blunder"
    if request.method == 'POST':
        user = User(username=request.args.get('username'), team=tTeam)
        user.set_password(request.args.get('password'))
        db.session.add(user)
        db.session.commit()
        print("REGISTERED A USER")
        return "Gods blunder"
    return "failed"

@app.route("/api/set_team", methods=['POST'])
@jwt_required
def set_team():
    team
    if(request.method == 'POST'):
        team = request.args.get('team')
    return team
    
    

@app.route("/api/stats", methods=['GET'])
def get_player(user_input = "lebron james", season = -1):
    if(request.method == 'GET'):
        user_input=request.args.get('name')
        # season = int(request.args.get('season'))
    lowered = user_input
    print(lowered)
    ab = []
    try:
        return search_player(lowered)
        
        # if(season!= -1):
        #     playerInfo = playerdf.loc[season][['SEASON_ID','TEAM_ABBREVIATION','GP','FG_PCT', 'FG3_PCT','FT_PCT','PTS','REB','AST','STL','BLK','TOV','PLAYER_ID']]
        #     playerInfo = playerInfo.tolist()
        #     playerInfo.append(playerdf.shape[0])
        #     return json.dumps(playerInfo, default=np_encoder)
        for a in range(playerdf.shape[0]):
            playerInfo = playerdf.loc[a][['SEASON_ID','TEAM_ABBREVIATION','GP','FG_PCT', 'FG3_PCT','FT_PCT','PTS','REB','AST','STL','BLK','TOV','PLAYER_ID']]
            playerInfo = playerInfo.tolist()
            playerInfo.append(playerdf.shape[0])
            ab.append(json.dumps(playerInfo, default=np_encoder))
        return ab
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