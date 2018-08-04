import * as Discord from "discord.js";
import { Game } from "./models/gameModel"

import { GameLookup } from "./core/gameLookup";

import { CommandHandler } from "./core/commandHandler";
import { HelpCommand } from "./commands/help";
import { GamesCommand } from "./commands/games";

import { logger } from "./core/logger"

class ChatBot {

	public client: Discord.Client;
	public commandHandler: CommandHandler;

	constructor() {
		this.client = new Discord.Client();

		this.client.login(process.env.DISCORD_BOT_TOKEN);
		this.client.on("ready", this.ready.bind(this));

		this.client.on("presenceUpdate", this.onPresenceUpdate.bind(this))

		// register command handler
		this.commandHandler = new CommandHandler(this.client);

		this.commandHandler.register(new GamesCommand());
		this.commandHandler.register(new HelpCommand());

	}

	ready() {
		this.fetchGames();
	}

	async onPresenceUpdate(oldRef: Discord.GuildMember, newRef: Discord.GuildMember) {
		const userID = newRef.id;

		this.setGameState(userID, newRef.presence);
	}

	async fetchGames() {
		this.client.guilds.forEach(async guild => {
			const users = await guild.fetchMembers();
			users.presences.forEach(async (presence, id) => {
				this.setGameState(id, presence);
			});
		});
	}

	async setGameState(userID: string, presence: Discord.Presence) {

		const userObject = await this.client.fetchUser(userID);
		const userGame = await Game.findOne({ userID: userID });

		// have database entry but we found them not in a game
		if (presence.game === null && userGame !== null) {
			logger.debug(`[setGameState] Removing ${userObject.username}'s game to null`)
			return await Game.remove({ userID: userID });
		}

		// if the previous does not return 
		if (presence.game === null) {
			return;
		}

		// use the service to grab the game info
		const gameResult = await GameLookup.searchGame(presence.game.name);

		// we don't want to update if the game db finds nothing 
		if (gameResult === null) {
			return;
		}

		// users is playing a game and we got an API response
		// create users game record in the databse
		if (userGame === null && gameResult !== null) {
			logger.debug(`[setGameState] Creating ${userObject.username}'s game "${presence.game.name}"`)
			await Game.create({
				userID: userID,
				game: presence.game.name,
				gameID: gameResult.id
			});
		}

		// users changes states playing a game and we got an API response
		// create users game record in the databse
		if (userGame !== null && gameResult !== null) {
			logger.debug(`[setGameState] Updating ${userObject.username}'s game to "${presence.game.name}"`)
			await Game.update({ userID: userID }, {
				userID: userID,
				game: presence.game.name,
				gameID: gameResult.id
			});
		}

	}


}

export { ChatBot }