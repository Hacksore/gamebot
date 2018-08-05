import { BaseCommand } from "../core/baseCommand"
import * as Discord from "discord.js";
import { GameCache } from "../models/gameCacheModel";
import { Game } from "../models/gameModel"
import { logger } from "../core/logger";

import * as os from "os";
class GamesCommand extends BaseCommand {

	private server;

	constructor(client: Discord.Client) {
		super(client);
		this.name = "games";

		this.server = process.env.DOCKER ? "dev.pi.gg" : "localhost:8080";
	}

	async onCommand(message: Discord.Message, args: String[]) {

		if (message.guild === null) {
			// return;
		}

		const games = await GameCache.find({});
		const sortedGames = [];
		for (const key in games) {
			const game: any = games[key];

			const document = await Game.find({ gameID: game.id });

			const count = await Game.find({ gameID: game.id }).countDocuments();

			if (count === 0) {
				continue;
			}

			sortedGames.push({
				count: count,
				name: game.name,
				id: game.id,
				users: document
			});
		}

		sortedGames.sort((a, b) => {
			return b.count - a.count;
		});

		let embed = new Discord.RichEmbed({
			fields: [],
		})
		const users = [];

		embed.title = "TOP GAMES";

		for (let gameObject of sortedGames) {

			// only show ones with more than 1 player
			if (gameObject.count <= 1) {
				continue;
			}

			const record = {
				name: gameObject.name,
				value: gameObject.count + " users playing"
			};

			//embed.fields.push(record);
			users.push(`[**${gameObject.count} players**] **[${gameObject.name}](http://${this.server}/game/${gameObject.id})**`);
		}
		embed.setDescription(users.join("\n"));

		message.channel.send(embed);

	}
}
export { GamesCommand }