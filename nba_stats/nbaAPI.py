import numpy as np
from nba_api.stats.endpoints import playercareerstats, commonteamroster
from nba_api.stats.static import players, teams
from nba_api.stats.endpoints import teamgamelog
from nba_api.stats.endpoints.teamgamelogs import TeamGameLogs
import json
import asyncio
player_dict = ""
gamelogs = teamgamelog.TeamGameLog
team_dict = teams.find_team_by_abbreviation("GSW")
#change this to use json
def search_player(user_input = "lebron james"):
    lowered = user_input
    print(lowered)
    try:
        player = players.find_players_by_full_name(lowered)[0]
        playerid = str(player['id'])
        playerstats = playercareerstats.PlayerCareerStats(player_id=playerid)
        f = open('player_data.json')
        p_dict = json.load(f)
        test = [p_dict[playerid]['player_name']]
        test.append(playerstats.get_dict()["resultSets"][0]["rowSet"])
        #print(playerstats.get_dict()["resultSets"][0]["headers"])
        return test
    except IndexError:
        raise IndexError("Player Not Found")

def search_team(team_input = "GSW"):
    try:
        team = teams.find_teams_by_full_name(team_input)[0]
        return team["full_name"]
    except:
        team = teams.find_team_by_abbreviation(team_input)
        return team['full_name']
    
def get_team_games(team_input = "Golden State Warriors"):
    team = search_team(team_input=team_input)
    f = open('team_gamelogs.json')
    tg_dict = json.load(f)
    tg_json = tg_dict[team]
    return tg_json
# def get_players(team_input = "GSW"):
#         ab = []
#         teamID = teams.find_teams_by_full_name(team_input)[0]["id"]
#         player = commonteamroster.CommonTeamRoster(teamID).get_dict()["resultSets"][0]["rowSet"]
#         for a in player:
#             try:
#                 temp = playercareerstats.PlayerCareerStats(player_id=a[14]).get_dict()["resultSets"][0]["rowSet"]
#                 temp = temp[len(temp)-1]
#                 temp.append(a[3])
#                 ab.append(temp)
#             except:
#                 print("Player of ID Could Not Be Found: ", a[14])
#         ae = sorted(ab, reverse=True, key=lambda x: x[9])
#         return ae
import time



def get_players(team_input="Atlanta Hawks"):
    f = open('team_data.json')
    team_dict = json.load(f)
    team_input = search_team(team_input)
    player_of_team = team_dict[team_input]["players"]
    format = []
    for p in player_of_team[0]:
        temp = []
        season = p["player_stats"]
        if(len(season) != 0):
            season = season[len(season)-1]
            if(season[1] == "2024-25"):
                format.append([p["player_name"],season])
    format.sort(key=lambda x: x[1][9], reverse=True)
    print(format)
    
    return format

#def get_recent_game(team_input):

    
async def updateJsongames():
    team_list = teams.get_teams()
    all_logs = {}
    for t in team_list:
        await asyncio.sleep(0.5)
        logs = gamelogs(team_id=t["id"], season='2024-25')
        await asyncio.sleep(0.5)
        headers = logs.get_dict()["resultSets"][0]['headers']
        await asyncio.sleep(0.5)
        a = logs.get_dict()["resultSets"][0]['rowSet']
        array = []
        for j in range(len(a)):
            logdict = {}
            for i in range(len(headers)):
                logdict[headers[i]] = a[j][i]
            array.append(logdict)
        jsondict = {
            "team_name": t["full_name"],
            "team_logs": array
        }
        all_logs[jsondict["team_name"]] = jsondict["team_logs"]
    filename = 'team_gamelogs.json'
    with open(filename, 'w') as file:
        json.dump(all_logs, file, indent = 4)
    print("Finished updating gamelogs....\n")

async def updateJsonteam():
    t = 1
    team_dict = {}
    team_list = teams.get_teams()
    for t in team_list:
        #print(t)
        jsondict = {
            "team_name": t["full_name"],
            "team_id": t["id"]
        }
        player = commonteamroster.CommonTeamRoster(t["id"]).get_dict()["resultSets"][0]["rowSet"]
        player_list = []
        for p in player:
            player_dict = {
                "player_name": p[3],
                "player_id": p[14],
                "player_stats": playercareerstats.PlayerCareerStats(player_id=p[14]).get_dict()["resultSets"][0]["rowSet"]
            }
            await asyncio.sleep(0.5)
            player_list.append(player_dict)
        jsondict["players"] = [player_list]
        #print("--------------\n\n")
        team_dict[jsondict["team_name"]] = jsondict
    filename = 'team_data.json'
    with open(filename, 'w') as file:
        json.dump(team_dict, file, indent = 4)
    print("Finished update team_data....\n")

async def updateJsonplayers():
    player_col = players.get_active_players()
    player_dic = {}
    for p in player_col:
        p_dict = {
            "player_name" : p["full_name"],
            "player_stats" : playercareerstats.PlayerCareerStats(player_id=p["id"]).get_dict()["resultSets"][0]["rowSet"],
        }
        #print(p)
        await asyncio.sleep(0.5)
        player_dic[p["id"]] = p_dict
    filename = 'player_data.json'
    with open(filename, 'w') as file:
         json.dump(player_dic, file, indent = 4)
    print("Finished update player_data....\n")
