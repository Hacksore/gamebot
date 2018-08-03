import { BaseCommand } from "../core/baseCommand"
import * as Discord from "discord.js";

class CommandHandler {

	public commands: Map<String, BaseCommand> = new Map<String, BaseCommand>();
	public client: Discord.Client;

	constructor(client: Discord.Client) {
		this.client = client;

		//test this
		this.client.on("message", this.onMessage.bind(this));
	}

	register(command: BaseCommand) {
		this.commands.set(command.name, command);
	}

	onMessage(message: Discord.Message) {
		const rawMessage = message.content
		const rawArgs = rawMessage.split(" ");
		const command = rawArgs[0].substr(1);
		const args = rawArgs.splice(1);

		const commandRef: BaseCommand = this.commands.get(command);
		if (commandRef !== null) {
			try {
				commandRef.onCommand(message, args);
			} catch (e) {

			}
		}
	}

}

export { CommandHandler }