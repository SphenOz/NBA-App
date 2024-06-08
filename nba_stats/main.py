from nba_api.stats.static import players
import pandas as pd

player_dict = players.get_active_players()
curry = [player for player in player_dict if player['full_name'] == 'Stephen Curry'][0]
curryid = curry['id']

from nba_api.stats.endpoints import playercareerstats

currystats = playercareerstats.PlayerCareerStats(player_id='201939')
currydf = currystats.get_data_frames()[0]
print(currydf.loc[1])

print("breakpoint")
