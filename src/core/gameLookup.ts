import igdb from "igdb-api-node";
import { GameCache } from "../models/gameCacheModel";
import { logger } from "./logger"

require("dotenv").config();

const gameDB = igdb(process.env.IGDB_API_KEY);
class GameLookup {

	static async findGame(gameName: String) {
		return await GameCache.findOne({ name: gameName });
	}

	static async searchGame(gameName: String) {

		const game = await this.findGame(gameName);
		if (game !== null) {
			logger.debug(`[GAMECACHE] Found "${gameName}", fetching from DB`);
			return game;
		}

		const response = await gameDB.games({
			limit: 1,
			search: gameName
		}, ["name", "cover"]);

		const result = response.body[0];

		// add game to mongo for later lookups
		logger.debug(`[GAMECACHE] Could not find "${gameName}", creating`);
		GameCache.create({
			name: gameName,
			id: result.id,
			cover: result.cover
		});

		return result;
	}


}

export { GameLookup }