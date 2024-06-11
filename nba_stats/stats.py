from nba_api.stats.static import players
import pandas as pd

player_dict = players.get_active_players()
curry = [player for player in player_dict if player['full_name'].lower() == 'stephen curry'][0]
curryid = curry['id']

from nba_api.stats.endpoints import playercareerstats

currystats = playercareerstats.PlayerCareerStats(player_id='201939')
currydf = currystats.get_data_frames()[0]
print(currydf.loc[1]["FGM"])

print("breakpoint")

def get_player(user_input) -> str:
    lowered = user_input.lower()
    try:
        player = [player for player in player_dict if player['full_name'].lower() == lowered][0]
        playerid = str(player['id'])
        playerstats = playercareerstats.PlayerCareerStats(player_id=playerid)
        playerdf = playerstats.get_data_frames()[0]
        playerPTS = playerdf.loc[playerdf.shape[0]-1]["PTS"]
        return f'This player scored {playerPTS} The Big Year 2024'
    except IndexError:
        return "^ Is a loser"

