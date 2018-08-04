import { BaseCommand } from "../core/baseCommand"
import * as Discord from "discord.js";
import { GameCache } from "../models/gameCacheModel";
import { Game } from "../models/gameModel"

class GamesCommand extends BaseCommand {

	constructor() {
		super();
		this.name = "games";
	}

	async onCommand(message: Discord.Message, args: String[]) {
		if (message.guild === null) {
			return;
		}

		const games = await GameCache.find({});
		const sortedGames = [];
		let gameList = "";

		for (const key in games) {
			const game: any = games[key];

			const count = await Game.find({ gameID: game.id }).countDocuments();

			if (count === 0) {
				continue;
			}

			sortedGames.push({
				count: count,
				name: game.name
			});
		}

		sortedGames.sort((a, b) => {
			return b.count - a.count;
		});

		let embed = new Discord.RichEmbed({
			fields: [],
		})

		for (let gameObject of sortedGames) {
			//gameList += gameObject.name + ` (${gameObject.count})\n`;
			embed.fields.push({
				name: gameObject.name,
				value: gameObject.count
			})
		}

		//message.channel.sendCode("javascript", gameList);
		message.channel.send(embed);
	}
}
export { GamesCommand }