import numpy as np
from nba_api.stats.endpoints import playercareerstats, commonteamroster
from nba_api.stats.static import players, teams
from nba_api.stats.endpoints import teamgamelog
from nba_api.stats.endpoints.teamgamelogs import TeamGameLogs
from nba_api.stats.endpoints import boxscoretraditionalv3
from nba_api.stats.endpoints import leaguegamefinder
from nba_api.stats.library.parameters import SeasonTypeAllStar
import pandas as pd

import json
import asyncio
player_dict = ""
gamelogs = teamgamelog.TeamGameLog
llogs = leaguegamefinder.LeagueGameFinder(season_type_nullable=SeasonTypeAllStar.regular, season_nullable='2024-25')
loogs =llogs.get_data_frames()[0]
loogs.to_html('test.html')
#print(loogs['GAME_ID'].unique())
boxscore = boxscoretraditionalv3.BoxScoreTraditionalV3
box = boxscore(game_id="0022400508").get_dict()
# filename = 'readability.json'
# with open(filename, 'w') as file:
#     json.dump(box, file, indent = 4)
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

def search_career(playername):
    
    print(playername)
    f = open('player_career_avg.json')
    player_data = json.load(f)
    for key in player_data:
        if player_data[key]["player_name"].lower() == playername.lower():
            career_data = player_data[key]["player_stats"]
            career_data.append(key)
            return career_data

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

def get_player_names():
    f = open('player_data.json')
    player_dict = json.load(f)
    player_names = []
    for p in player_dict:
        player_names.append(player_dict[p]["player_name"])
    return player_names

def get_boxscore(game_id):
    f = open('game_boxscores.json')
    box_dict = json.load(f)
    game_box = box_dict[game_id]
    game_details = []
    home_details = []
    away_details = []
    for h in game_box["home_team"][0]:
        player_details = [
            h["nameI"],
            h["statistics"]["minutes"],
            h["statistics"]["fieldGoalsMade"],
            h["statistics"]["fieldGoalsAttempted"],
            round(h["statistics"]["fieldGoalsPercentage"]*100,1,),
            h["statistics"]["threePointersMade"],
            h["statistics"]["threePointersAttempted"],
            round(h["statistics"]["threePointersPercentage"]*100,1),
            h["statistics"]["freeThrowsMade"],
            h["statistics"]["freeThrowsAttempted"],
            round(h["statistics"]["freeThrowsPercentage"]*100,1),
            h["statistics"]["reboundsOffensive"],
            h["statistics"]["reboundsDefensive"],
            h["statistics"]["reboundsTotal"],
            h["statistics"]["assists"],
            h["statistics"]["steals"],
            h["statistics"]["blocks"],
            h["statistics"]["turnovers"],
            h["statistics"]["foulsPersonal"],
            h["statistics"]["points"],
            h["statistics"]["plusMinusPoints"],
            h["personId"]
        ]
        home_details.append(player_details)
    home_details.append(list(game_box["home_team"][1].values()))
    for a in game_box["away_team"][0]:
        player_details = [
            a["nameI"],
            a["statistics"]["minutes"],
            a["statistics"]["fieldGoalsMade"],
            a["statistics"]["fieldGoalsAttempted"],
            a["statistics"]["fieldGoalsPercentage"],
            a["statistics"]["threePointersMade"],
            a["statistics"]["threePointersAttempted"],
            a["statistics"]["threePointersPercentage"],
            a["statistics"]["freeThrowsMade"],
            a["statistics"]["freeThrowsAttempted"],
            a["statistics"]["freeThrowsPercentage"],
            a["statistics"]["reboundsOffensive"],
            a["statistics"]["reboundsDefensive"],
            a["statistics"]["reboundsTotal"],
            a["statistics"]["assists"],
            a["statistics"]["steals"],
            a["statistics"]["blocks"],
            a["statistics"]["turnovers"],
            a["statistics"]["foulsPersonal"],
            a["statistics"]["points"],
            a["statistics"]["plusMinusPoints"],
            a["personId"]
        ]
        away_details.append(player_details)
    away_details.append(list(game_box["away_team"][1].values()))
    game_details.append(home_details)
    game_details.append(away_details)
    return game_details
    #print(game_details[0])
#get_boxscore("0022400508")
#def get_recent_game(team_input):

    
async def updateJsongames():
    print("STARTING")
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
            logdict["OPPONENT"] = logdict["MATCHUP"][-3:]
            logdict["OPPONENT_ID"] = teams.find_team_by_abbreviation(logdict["OPPONENT"])["id"]
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

#async def updateBoxScores():
    

async def updateJsonteam():
    print("Starting Update Team Data....")
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
    print("Starting Update Player Data....")
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

async def updateJsonCareerAvg():
    print("Starting Update Player Career Stats....")
    player_col = players.get_active_players()
    player_dic = {}
    
    for p in player_col:
        temp = playercareerstats.PlayerCareerStats(player_id=p["id"]).get_dict()["resultSets"][0]["rowSet"]
        season_stats = []
        career_stats = []
        for stats in temp:
            games_played = stats[6]
            if games_played > 0:  # To avoid division by zero
                season_stats = [
                    stats[1],                             # Season
                    stats[4],                             # Team
                    games_played,                         # Games Played
                    round(stats[8] / games_played, 1),    # Minutes Played per Game
                    round(stats[26] / games_played, 1),   # Points Per Game
                    round(stats[21] / games_played, 1),   # Assists Per Game
                    round(stats[20] / games_played, 1),   # Rebounds Per Game
                    round(stats[9] / games_played, 1),    # Field Goals Made Per Game
                    round(stats[10] / games_played, 1),   # Field Goals Attempted Per Game
                    round(stats[11]*100,2),                 # Field Goal Percentage
                    round(stats[12] / games_played, 1),   # 3-Point Field Goals Made Per Game
                    round(stats[13] / games_played, 1),   # 3-Point Field Goals Attempted Per Game
                    round(stats[14]*100,2),                 # 3-Point Percentage
                    round(stats[15] / games_played, 1),   # Free Throws Made Per Game
                    round(stats[16] / games_played, 1),   # Free Throws Attempted Per Game
                    round(stats[17]*100,2),                  # Free Throw Percentage
                    round(stats[22] / games_played, 1),   # Steals Per Game
                    round(stats[23] / games_played, 1),   # Blocks Per Game
                    round(stats[24] / games_played, 1),   # Turnovers Per Game
                    round(stats[25] / games_played, 1)    # Fouls Per Game
                ]
                career_stats.append(season_stats)
        await asyncio.sleep(0.5)
        p_dict = {
            "player_name" : p["full_name"],
            "player_stats" : career_stats,
        }
        #print(p)
        
        player_dic[p["id"]] = p_dict
    filename = 'player_career_avg.json'
    with open(filename, 'w') as file:
         json.dump(player_dic, file, indent = 4)
    print("Finished update player_career_stats....\n")

async def update_game_boxscore():
    print("Starting Update Game Boxscores....")
    game_list = loogs['GAME_ID'].unique()
    all_boxscores = {}
    for gameid in game_list:
        await asyncio.sleep(1)
        box = boxscore(game_id=gameid).get_dict()
        await asyncio.sleep(.3)
        home_team = box['boxScoreTraditional']['homeTeam']['players']
        away_team = box['boxScoreTraditional']['awayTeam']['players']
        home_team_stats = []
        away_team_stats = []
        for h in home_team:
            home_team_stats.append(h)
        for a in away_team:
            away_team_stats.append(a)
        jsondict = {
            "home_team": [home_team_stats, box['boxScoreTraditional']['homeTeam']['statistics']],
            "away_team": [away_team_stats, box['boxScoreTraditional']['awayTeam']['statistics']],
        }
        all_boxscores[gameid] = jsondict
    filename = 'game_boxscores.json'
    with open(filename, 'w') as file:
        json.dump(all_boxscores, file, indent = 4)
    print("Finished updating game boxscores....\n")