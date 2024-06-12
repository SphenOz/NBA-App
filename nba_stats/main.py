# bot.py
import os

import discord
from dotenv import load_dotenv
from discord import Intents, Client, Message, Embed
from stats import get_player

load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')
print(TOKEN)

intents: Intents = Intents.default()
intents.message_content = True #NOQA
client: Client = Client(intents=intents)

async def send_message(message: Message, user_message: str) -> None:
    if not user_message:
        print('(Message was empty, check intents)')
        return
    
    is_prefix =user_message[0] == '?'

    if is_prefix:
        user_message = user_message[1:]
        try:
            statList = get_player(user_message)
            embedV = Embed(title=user_message, color=0x00ff00, description="Basic Season Stats")
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
            await message.channel.send(embed=embedV)
        except Exception as e:
            if str(e) == "Player Not Found":
                await message.channel.send(content="y")

@client.event
async def on_ready() -> None:
    print(f'{client.user} is now live')

@client.event
async def on_message(message: Message) -> None:
    if message.author == client.user:
        return
    
    username = message.author
    user_message = message.content
    channel = message.channel

    print(f'[{channel}] {username}: "{user_message}"')
    await send_message(message, user_message)

def main() -> None:
    client.run(token=TOKEN)

if __name__ == '__main__':
    main()