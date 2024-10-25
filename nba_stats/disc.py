# bot.py
import os

import discord
from dotenv import load_dotenv
from discord import Intents, Client, Message, Embed, app_commands
from stats import get_player

load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')
print(TOKEN)

intents: Intents = Intents.default()
intents.message_content = True #NOQA
client: Client = Client(intents=intents)
tree = app_commands.CommandTree(client)

@tree.command(
        name="greetings",
        description="HI",
        guild=discord.Object(id=1089098338894352436)
)
async def greetings(interaction: discord.Interaction):
    await interaction.response.send_message("wassup")
    
@tree.command(
        name="echo",
        description="re",
        guild=discord.Object(id=1089098338894352436)
)
async def echo(interaction: discord.Interaction, word: str):
    await interaction.response.send_message(f'You said {word}')

@tree.command(
        name="findplayer",
        description="Gives regular season stats of given player",
        guild=discord.Object(id=1089098338894352436)
)
async def send_message(interaction: discord.Interaction, user_message: str) -> None:
    if not user_message:
        print('(Message was empty, check intents)')
        return

    try:
        statList = get_player(user_message)
        print(f'Seasons Played: {statList[13]}')
        embedV = create_player_embed(statList=statList, name=user_message)
        await interaction.response.send_message(embed=embedV, view=playerMenu(user_message, statList[13]-1))
    except Exception as e:
        if str(e) == "Player Not Found":
            await interaction.response.send(content="y")

class playerMenu(discord.ui.View):
    def __init__(self, player_name, seasons_played):
        self.player_name = player_name
        self.current_season = seasons_played
        self.seasons_played = seasons_played
        super().__init__(timeout=None)
    
    @discord.ui.button(label="Previous Season")
    async def prevSeason(self,  interaction: discord.Interaction, button: discord.ui.Button,):
        if(self.current_season!=0):
            self.current_season -=1
        a = get_player(self.player_name, self.current_season)
        await interaction.response.edit_message(embed=create_player_embed(statList=a,name=self.player_name))
    
    @discord.ui.button(label="Next Season")
    async def nextSeason(self,  interaction: discord.Interaction, button: discord.ui.Button,):
        if(self.current_season < self.seasons_played):
            self.current_season +=1
        a = get_player(self.player_name, self.current_season)
        await interaction.response.edit_message(embed=create_player_embed(statList=a,name=self.player_name))

    
def create_player_embed(statList, name: str):
    embedV = Embed(title=name, color=0x00ff00, description="Basic Season Stats")
    embedV.add_field(name="Season: ", value=statList[0], inline=True)
    embedV.add_field(name="Team: ", value=statList[1], inline=True)
    embedV.add_field(name="GP: \n", value=statList[2], inline=True)
    embedV.add_field(name="FG%: ", value=str(round(statList[3]*100,2)) + "%", inline=True)
    embedV.add_field(name="3PT%: ", value=str(round(statList[4]*100,2)) + "%    ", inline=True)
    embedV.add_field(name="FT%: ", value=str(round(statList[5]*100,2)) + "%", inline=True)
    embedV.add_field(name="PPG: ", value=round(statList[6]/statList[2],1), inline=True)
    embedV.add_field(name="RPG: ", value=round(statList[7]/statList[2],1), inline=True)
    embedV.add_field(name="APG: \n", value=round(statList[8]/statList[2],1), inline=True)
    embedV.add_field(name="SPG: ", value=round(statList[9]/statList[2],1), inline=True)
    embedV.add_field(name="BPG: ", value=round(statList[10]/statList[2],1), inline=True)
    embedV.add_field(name="TOV: ", value=round(statList[11]/statList[2],1), inline=True)
    urlI = f'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/{statList[12]}.png'
    print(urlI)
    embedV.set_image(url=urlI) 
    return embedV

@client.event
async def on_ready() -> None:
    await tree.sync(guild=discord.Object(id=1089098338894352436))
    print(f'{client.user} is now live')

@client.event
async def on_message(message: Message) -> None:
    if message.author == client.user:
        return
    
    username = message.author
    user_message = message.content
    channel = message.channel

    print(f'[{channel}] {username}: "{user_message}"')

def main() -> None:
    client.run(token=TOKEN)

if __name__ == '__main__':
    main()