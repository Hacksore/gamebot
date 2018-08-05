import * as Discord from "discord.js";
import { Game } from "./models/gameModel"

import { GameLookup } from "./core/gameLookup";

import { CommandHandler } from "./core/commandHandler";
import { HelpCommand } from "./commands/help";
import { GamesCommand } from "./commands/games";

import { logger } from "./core/logger"
import { util } from "./core/util";

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

		this.commandHandler.register(new GamesCommand(this.client));
		this.commandHandler.register(new HelpCommand(this.client));

	}

	async ready() {
		logger.info("ChatBot ready")

		//let game = await util.getGameInfo("League of Legends");
		//console.log(game);

		this.fetchGames();

	}

	async onPresenceUpdate(oldRef: Discord.GuildMember, newRef: Discord.GuildMember) {
		const userID = newRef.id;
		this.setGameState(userID, newRef.presence, oldRef.presence);
	}

	async fetchGames() {
		this.client.guilds.forEach(async guild => {
			const users = await guild.fetchMembers();
			users.presences.forEach(async (presence, id) => {
				this.setGameState(id, presence, null);
			});
		});
	}

	async setGameState(userID: string, newPresence: Discord.Presence, oldPresence: Discord.Presence) {

		const userObject = await this.client.fetchUser(userID);
		const userGame = await Game.findOne({ userID: userID });

		// have database entry but we found them not in a game
		if (newPresence.game === null && userGame !== null) {
			logger.debug(`[setGameState] Removing ${userObject.username}'s game to null`)
			return await Game.remove({ userID: userID });
		}

		// if the previous does not return 
		if (newPresence.game === null) {
			return;
		}


		if (newPresence.game.name && oldPresence !== null && oldPresence.game) {
			// we have an old game lets make sure we dont update the same one with shit like Runescape actions				
			if (newPresence.game.name === oldPresence.game.name) {
				return;
			}
		}

		// use the service to grab the game info
		const gameResult = await GameLookup.searchGame(newPresence.game.name);
		//console.log("RES: " + gameResult.name);

		// we don't want to update if the game db finds nothing 
		if (gameResult === null) {
			return;
		}

		// users is playing a game and we got an API response
		// create users game record in the databse
		if (userGame === null && gameResult !== null) {
			try {
				logger.debug(`[setGameState] Creating ${userObject.username}'s game "${newPresence.game.name}"`)
				await Game.create({
					userID: userID,
					game: newPresence.game.name,
					gameID: gameResult.id,
					//guildID: userObject.
				});
			} catch { }
		}

		// users changes states playing a game and we got an API response
		// create users game record in the databse
		if (userGame !== null && gameResult !== null) {

			try {
				logger.debug(`[setGameState] Updating ${userObject.username}'s game to "${newPresence.game.name}"`)
				await Game.update({ userID: userID }, {
					userID: userID,
					game: newPresence.game.name,
					gameID: gameResult.id
				});
			} catch { }

		}

	}


}

export { ChatBot }