from nba_api.stats.static import players
import pandas as pd
from difflib import SequenceMatcher
import json

player_dict = players.get_active_players()
curry = [player for player in player_dict if player['full_name'].lower() == 'stephen curry'][0]
curryid = curry['id']
with open('active_player_names.json') as data_file:    
    data = json.load(data_file)
for name in data:
    if SequenceMatcher(None,"curry",name['full_name']).ratio() > .4:
        print(name)

print(SequenceMatcher(None,"curry","Stephen Curry").ratio())

from nba_api.stats.endpoints import playercareerstats

currystats = playercareerstats.PlayerCareerStats(player_id='201939')
currydf = currystats.get_data_frames()[0]
abc = currydf.loc[currydf.shape[0]-1][['SEASON_ID','TEAM_ABBREVIATION','GP','FG_PCT','FG3_PCT','FT_PCT','REB','AST','STL','BLK','TOV','PTS']]
abc = abc.tolist()
print(abc)

print("breakpoint")

def get_player(user_input):
    lowered = user_input.lower()
    try:
        player = [player for player in player_dict if player['full_name'].lower() == lowered][0]
        playerid = str(player['id'])
        playerstats = playercareerstats.PlayerCareerStats(player_id=playerid)
        playerdf = playerstats.get_data_frames()[0]
        playerInfo = playerdf.loc[playerdf.shape[0]-1][['SEASON_ID','TEAM_ABBREVIATION','GP','FG_PCT', 'FG3_PCT','FT_PCT','PTS','REB','AST','STL','BLK','TOV','PLAYER_ID']]
        return playerInfo.tolist()
    except IndexError:
        raise IndexError("Player Not Found")

