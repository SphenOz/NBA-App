import numpy as np
from nba_api.stats.endpoints import playercareerstats
from nba_api.stats.static import players, teams

player_dict = players.get_active_players()
team_dict = teams.get_teams()
print(team_dict)
def search_player(user_input = "lebron james"):
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
    except IndexError:
        raise IndexError("Player Not Found")

def search_team(team_input = "GSW"):
    team = [team for team in team_dict if team['full_name'].lower() == team_input.lower()][0]
    if not team:
        team = [team for team in team_dict if team['abbreviation'].lower() == team_input.lower()][0]
    return team['full_name']

print(search_team("Golden State Warriors"))