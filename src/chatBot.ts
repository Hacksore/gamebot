import * as Discord from "discord.js";
import { Game } from "./models/gameModel"

import { GameLookup } from "./core/gameLookup";

import { CommandHandler } from "./core/commandHandler";
import { HelpCommand } from "./commands/help";
import { GamesCommand } from "./commands/games";
class ChatBot {

	public client: Discord.Client;
	public commandHandler: CommandHandler;

	constructor() {
		this.client = new Discord.Client();

		this.client.login(process.env.DISCORD_BOT_TOKEN);
		this.client.on("ready", this.ready.bind(this));

		// register command handler
		this.commandHandler = new CommandHandler(this.client);

		this.commandHandler.register(new GamesCommand());
		this.commandHandler.register(new HelpCommand());

		setInterval(() => {
			// update games every 5 minutes 
			console.log("Updating games!")
			this.fetchGames();
		}, 1000 * 300);
	}


	ready() {
		this.fetchGames();
	}

	fetchGames() {
		this.client.guilds.forEach(async guild => {
			const users = await guild.fetchMembers();
			users.presences.forEach(async (pres, id) => {
				if (pres.status === "online" && pres.game !== null) {
					const gameName = pres.game.name;
					const game = await GameLookup.searchGame(gameName);

					const userGame = await Game.findOne({ userID: id });

					if (userGame === null) {
						Game.create({
							userID: id,
							game: gameName,
							gameID: game.id
						});
					} else {

						await Game.update({ userID: id }, {
							game: gameName,
							gameID: game.id
						});
					}
				}

				if (pres.status === "online" && pres.game === null) {
					await Game.remove({ userID: id });
				}
			});
		})
	}

}

export { ChatBot }