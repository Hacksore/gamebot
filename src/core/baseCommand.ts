import * as Discord from "discord.js";

class BaseCommand {
	public name: String;
	onCommand(message: Discord.Message, args: String[]) { }
}

export { BaseCommand } 