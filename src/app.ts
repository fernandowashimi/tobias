import { Client, Message, Collection } from "discord.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

import config from "./config";

class DiscordApp {
  private client: Client;
  private commands: Collection<string, any>;

  constructor() {
    this.client = new Client();
    this.commands = new Collection();

    this.environment();
    this.loadCommands();
  }

  private environment(): void {
    dotenv.config();
  }

  public start(): void {
    this.client.login(process.env.TOKEN);

    this.client.on("ready", () => {
      console.log("Beep boop... I'm ready!");
    });

    this.client.on("message", (message: Message) => {
      const prefix = config.prefix;
      if (!message.content.startsWith(prefix) || message.author.bot) return;

      const args = message.content.slice(prefix.length).split(" ");
      const commandName = args.shift().toLocaleLowerCase();

      if (!this.commands.has(commandName)) return;

      const command = this.commands.get(commandName);

      try {
        command.execute(message, args);
      } catch (error) {
        console.log(error);
        message.reply("Something went wrong *beep*");
      }
    });
  }

  private loadCommands(): void {
    const files = fs.readdirSync(path.join(__dirname, "/commands"));
    files.forEach((file: string) => {
      const command = require(path.join(__dirname, `/commands/${file}`))
        .default;
      this.commands.set(command.name, command);
    });
  }
}

export default new DiscordApp();
