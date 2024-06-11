# bot.py
import os

import discord
from dotenv import load_dotenv
from discord import Intents, Client, Message
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
    
    is_private =user_message[0] == '?'

    if is_private:
        user_message = user_message[1:]
    
    try:
        response = get_player(user_message)
        await message.author.send(response) if is_private else await message.channel.send(response)
    except Exception as e:
        print(e)

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