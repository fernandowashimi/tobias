import { Message } from "discord.js";

interface CommandParameters {
  name: string;
  description: string;
  usage: string;
  argsSize: ArgumentsSize;
}

interface ArgumentsSize {
  min: number;
  max: number;
}

class Command {
  public name: string;
  public description: string;
  public usage: string;
  public argsSize: ArgumentsSize;

  constructor(command: CommandParameters) {
    this.name = command.name;
    this.description = command.description;
    this.usage = command.usage;
    this.argsSize = command.argsSize;
  }

  public isArgsValid(args: string[]): boolean {
    return (
      !args ||
      args.length < this.argsSize.min ||
      args.length > this.argsSize.max
    );
  }

  public sendError(message: Message): Promise<Message> {
    return message.channel.send(
      `Mr <@${message.author.id}>, I don't feel so good...\nTry \`${this.usage}\``
    );
  }
}

export default Command;
