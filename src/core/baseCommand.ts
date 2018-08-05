import * as Discord from "discord.js";

class BaseCommand {
	public name: String;
	public client: Discord.Client;

	constructor(client: Discord.Client) {
		this.client = client;
	}

	onCommand(message: Discord.Message, args: String[]) { }


}

export { BaseCommand } 