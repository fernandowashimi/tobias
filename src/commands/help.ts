import { Message } from 'discord.js'

interface ArgumentsSize {
  min: number
  max: number
}

class HelpCommand {
  public name: string
  public description: string
  public format: string
  private argsSize: ArgumentsSize

  constructor () {
    this.name = 'help'
    this.description = 'Display all commands available'
    this.format = '!help'
    this.argsSize = {
      min: 0,
      max: 0
    }
  }

  public execute (message: Message, args?: string[]): Promise<Message> {
    if (!args || args.length < this.argsSize.min || args.length > this.argsSize.max) {
      return message.channel.send(`Hum... I think something is wrong with \`${this.name}\`. Did you tried: \`${this.format}\``)
    }

    return message.channel.send(`Hey, ${message.author.username}! Here are all the commands you can use`)
  }
}

export default new HelpCommand()
