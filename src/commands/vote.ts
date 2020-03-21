import { Message } from "discord.js";
import Command from "../base/command";

import config from "../config";

class VoteCommand extends Command {
  constructor() {
    super({
      name: "vote",
      description: "Starts a poll",
      usage: "!vote [subject or subject URL]",
      argsSize: {
        min: 1,
        max: 1
      }
    });
  }

  public execute(message: Message, args?: string[]): Promise<void | Message> {
    if (this.isArgsValid(args)) {
      return this.sendError(message);
    }

    const embed: any = {
      color: 0xf71963,
      title: "View subject card",
      author: {
        name: `${message.author.username} started a poll`,
        icon_url: `${message.author.avatarURL()}`
      },
      description: "React with emojis to vote"
    };

    const arg = args[0];
    const regex = new RegExp(
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm
    );

    if (regex.test(arg)) {
      embed.url = arg;
    } else {
      embed.title = arg;
    }

    return message.channel.send({ embed }).then((message: Message) => {
      config.cards.forEach(card => {
        const emoji = message.guild.emojis.cache.find(
          emoji => emoji.name === card.emoji
        );

        if (emoji) {
          message.react(emoji);
        } else {
          return;
        }
      });

      const filter = (reaction, user) => {
        console.log(
          !user.bot &&
            config.cards.some(card => card.emoji === reaction._emoji.name)
        );
        return (
          !user.bot &&
          config.cards.some(card => card.emoji === reaction._emoji.name)
        );
      };

      message
        .awaitReactions(filter, {
          time: 120000,
          errors: ["time"]
        })
        .then(collected => {
          // TODO
        })
        .catch(error => {
          // TODO
        });
    });
  }
}

export default new VoteCommand();
