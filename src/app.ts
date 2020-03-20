import { Client, Message, Collection } from 'discord.js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

class DiscordApp {
  private client: Client
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private commands: Collection<string, any>

  constructor () {
    this.client = new Client()
    this.commands = new Collection()

    this.environment()
    this.loadCommands()
  }

  private environment (): void {
    dotenv.config()
  }

  public start (): void {
    this.client.login(process.env.TOKEN)

    this.client.on('ready', () => {
      console.log('Beep boop... I\'m ready!')
    })

    this.client.on('message', (message: Message) => {
      const prefix = process.env.PREFIX
      if (!message.content.startsWith(prefix) || message.author.bot) return

      const args = message.content.slice(prefix.length).split(' ')
      const command = args.shift().toLocaleLowerCase()

      if (!this.commands.has(command)) return

      this.commands.get(command).execute(message, args)
    })
  }

  private loadCommands (): void {
    const files = fs.readdirSync(path.join(__dirname, '/commands'))
    files.forEach((file: string) => {
      const command = require(path.join(__dirname, `/commands/${file}`)).default
      this.commands.set(command.name, command)
    })
  }
}

export default new DiscordApp()
