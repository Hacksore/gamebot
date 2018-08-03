import igdb from "igdb-api-node";
import { GameCache } from "../models/gameCacheModel";
const gameDB = igdb("e56c9b004b1c7a655655541fc0d990c9");

class GameLookup {

	static async findGame(gameName: String) {
		return await GameCache.findOne({ name: gameName });
	}

	static async searchGame(gameName: String) {

		const game = await this.findGame(gameName);
		if (game !== null) {
			return game;
		}

		const response = await gameDB.games({
			limit: 1,
			search: gameName
		}, ["name", "cover"]);

		const result = response.body[0];

		// add game to mongo for later lookups
		GameCache.create({
			name: gameName,
			id: result.id,
			cover: result.cover
		});

		return result;
	}


}

export { GameLookup }