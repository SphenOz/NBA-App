import numpy as np
from nba_api.stats.endpoints import playercareerstats, commonteamroster
from nba_api.stats.static import players, teams

player_dict = ""
team_dict = teams.find_team_by_abbreviation("GSW")
def search_player(user_input = "lebron james"):
    lowered = user_input
    print(lowered)
    ab = []
    try:
        player = players.find_players_by_full_name(lowered)[0]
        playerid = str(player['id'])
        playerstats = playercareerstats.PlayerCareerStats(player_id=playerid)
        playerdf = playerstats.get_data_frames()[0]
        test = playerstats.get_dict()["resultSets"][0]["rowSet"]
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
    
def get_players(team_input = "GSW"):
        ab = []
        teamID = teams.find_teams_by_full_name(team_input)[0]["id"]
        player = commonteamroster.CommonTeamRoster(teamID).get_dict()["resultSets"][0]["rowSet"]
        for a in player:
            try:
                temp = playercareerstats.PlayerCareerStats(player_id=a[14]).get_dict()["resultSets"][0]["rowSet"]
                temp = temp[len(temp)-1]
                temp.append(a[3])
                ab.append(temp)
            except:
                print("Player of ID Could Not Be Found: ", a[14])
        ae = sorted(ab, reverse=True, key=lambda x: x[9])
        return ae