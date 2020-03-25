import { Message, MessageEmbed, EmbedField } from "discord.js";
import Command from "../base/command";

import config from "../config";

interface Card {
  value: string;
  emoji: string;
  count?: number;
  votes?: string[];
}

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

    const {
      author: { username }
    } = message;
    const subject = args[0];
    const hasUrl = this.isValidUrl(subject);
    const pollResult = [...config.cards].map((card: Card) => {
      card["count"] = 0;
      card["votes"] = [];
      return card;
    });

    const embedMessage = new MessageEmbed()
      .setColor("#f71963")
      .setTitle(hasUrl ? "Open subject link" : `Subject: ${subject}`)
      .setURL(hasUrl ? subject : undefined)
      .setAuthor(`${username} started a poll`, message.author.avatarURL())
      .setDescription("React with emojis to register your vote")
      .setTimestamp()
      .setFooter("Beep boop", "https://i.imgur.com/VLDwWww.png");

    // pollResult.forEach(card => {
    //   embedMessage.addField(card.value, "▱▱▱▱▱▱▱▱▱▱ 0%");
    // });

    return message.channel.send(embedMessage).then((message: Message) => {
      this.reactWithCards(message);

      const registerVote = (reaction, user) => {
        if (
          user.bot ||
          !config.cards.some(card => card.emoji === reaction._emoji.name)
        ) {
          return false;
        }

        reaction.message.reactions.cache.each(reaction => {
          const votedCard = pollResult.find(
            card => card.emoji === reaction._emoji.name
          );
          votedCard.count = reaction.count - 1;
          votedCard.votes = reaction.users.cache
            .map(x => x.username)
            .filter(x => x !== "Tobias");
        });

        const voteCount = pollResult.reduce((x, y) => x + y.count, 0);

        const newEmbed = new MessageEmbed()
          .setColor("#f71963")
          .setTitle(hasUrl ? "Open subject link" : `Subject: ${subject}`)
          .setURL(hasUrl ? subject : undefined)
          .setAuthor(`${username} started a poll`, message.author.avatarURL())
          .setDescription("React with emojis to register your vote")
          .setTimestamp()
          .setFooter("Beep boop", "https://i.imgur.com/VLDwWww.png");

        pollResult.forEach(card => {
          const percentage = (card.count / voteCount) * 100;
          const fullBars = Math.floor(percentage / 10);
          let allBars = "";
          for (let i = 1; i <= 10; i++) {
            i <= fullBars ? (allBars += "▰") : (allBars += "▱");
          }
          newEmbed.addField(
            card.value,
            `${allBars} ${percentage.toFixed(0)}%\n${card.votes}`
          );
        });

        message.edit(newEmbed);
        return true;
      };

      message
        .awaitReactions(registerVote, { time: 15000 })
        .then(collected =>
          message.reply(`Poll ended with ${collected.size} votes`)
        )
        .catch(console.error);
    });
  }

  private reactWithCards(message: Message): void {
    config.cards.forEach(card => {
      const emoji = message.guild.emojis.cache.find(
        emoji => emoji.name === card.emoji
      );

      if (!emoji) return;

      message.react(emoji);
    });
  }

  private isValidUrl(url: string): boolean {
    const regex = new RegExp(
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm
    );

    return regex.test(url);
  }
}

export default new VoteCommand();
