from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import json
import sqlite3
import numpy as np
from config import Config
from nba_api.stats.endpoints import playercareerstats
from nba_api.stats.static import players
from pyback


player_dict = players.get_active_players()
app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app,db)
cors = CORS(app,origins="*")
userinput = "a"
season = -1

connect = sqlite3.connect('database.db')
cursor = connect.cursor()
cursor.execute(
    'CREATE TABLE IF NOT EXISTS USERS (ID INTEGER PRIMARY KEY, username, password, team )'
)
print(cursor.execute("SELECT username FROM USERS").fetchone())
@app.route("/api/user", methods=['GET', 'POST'])
def createUser():
    if request.method == 'POST':
        username = request.args.get('username')
        password = request.args.get('password')

        with sqlite3.connect('database.db') as user:
            cursor = user.cursor()
            cursor.execute("INSERT INTO USERS (username, password) VALUES (?,?)", (username, password))
            pop = cursor.execute("SELECT username FROM USERS WHERE username =?", [username])
            print("Successfully added: " + str(pop.fetchone()))
            user.commit()
        return username
    else:
        return "oops"

@app.route("/api/stats", methods=['GET'])
def get_player(user_input = "lebron james", season = -1):
    if(request.method == 'GET'):
        user_input=request.args.get('name')
        # season = int(request.args.get('season'))
    lowered = user_input
    print(lowered)
    ab = []
    try:
        player = [player for player in player_dict if player['full_name'].lower() == lowered][0]
        playerid = str(player['id'])
        playerstats = playercareerstats.PlayerCareerStats(player_id=playerid)
        playerdf = playerstats.get_data_frames()[0]
        test = playerstats.get_dict()["resultSets"][0]["rowSet"]
        print(playerstats.get_dict()["resultSets"][0]["headers"])
        return test
        
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

# def users():
#     return jsonify(
#         {
#             "users": [
#                 'coc',
#                 'doc'
#             ]
#         }
#     )
# dinkdonk = abc['SEASON_ID','TEAM_ABBREVIATION','GP','FG_PCT', 'FG3_PCT','FT_PCT','PTS','REB','AST','STL','BLK','TOV','PLAYER_ID']
# print(abc)


    
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