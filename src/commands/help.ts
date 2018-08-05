import { BaseCommand } from "../core/baseCommand"
import * as Discord from "discord.js";
class HelpCommand extends BaseCommand {

	constructor(client: Discord.Client) {
		super(client);
		this.name = "help";
	}

	async onCommand(message: Discord.Message, args: String[]) {
		message.reply("I'm just a simple bot xD mr " + message.author.id);
	}
}
export { HelpCommand }