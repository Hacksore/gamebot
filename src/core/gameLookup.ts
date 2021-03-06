import igdb from "igdb-api-node";
import { GameCache } from "../models/gameCacheModel";
import { logger } from "./logger"
import { util } from "./util";

require("dotenv").config();

const gameDB = igdb(process.env.IGDB_API_KEY);
class GameLookup {

	static async findGame(gameName: String) {
		return await GameCache.findOne({ name: gameName });
	}

	static async searchGame(gameName: String) {

		const game = await this.findGame(gameName);
		if (game !== null) {
			logger.info(`[GAMECACHE] Found "${gameName}", fetching from DB`);
			return game;
		}


		let result;
		try {
			/*
			response = await gameDB.games({
				fields: "*",
				platform: "PC",
				search: gameName
			}, ["name", "cover"]);

			result = response.body[0];
			*/
			const response = await util.getGameInfo(gameName);

			if (response.results[0] !== undefined) {
				result = response.results[0];
			}

		} catch (e) {
			result = null;
		}

		// don't add the game
		if (result === undefined || result === null) {
			logger.info(`[GAMECACHE] Could not find "${gameName}", returning null`);
			return null;
		}

		// add game to mongo for later lookups
		try {
			logger.info(`[GAMECACHE] Could not find "${gameName}", creating`);
			await GameCache.create({
				name: gameName,
				id: result.id
			});
		} catch {

		}

		return result;
	}


}

export { GameLookup }