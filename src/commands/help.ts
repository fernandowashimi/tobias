import { Message } from "discord.js";
import Command from "../base/command";

class HelpCommand extends Command {
  constructor() {
    super({
      name: "help",
      description: "Display all avalilable commands",
      usage: "!help",
      argsSize: {
        min: 0,
        max: 0
      }
    });
  }

  public execute(message: Message, args?: string[]): Promise<Message> {
    if (this.isArgsValid(args)) {
      return this.sendError(message);
    }

    return message.channel.send(
      `Hey, ${message.author.username}! Here are all the commands you can use`
    );
  }
}

export default new HelpCommand();
