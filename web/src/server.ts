import { ChatBot } from "./chatBot";
import * as express from "express";
import * as mongoose from "mongoose";
import * as Discord from "discord.js";

import { logger } from "./core/logger";

import { Game } from "./models/gameModel";
import { GameCache } from "./models/gameCacheModel";

require("dotenv").config();

const mongoServer = process.env.DOCKER !== undefined ? "mongo" : "localhost";

mongoose.connect(`mongodb://${mongoServer}:27017/gamebot`, {
	useNewUrlParser: true
});

const app = express();
app.get("/", async (req, res) => {

	const games = await Game.find({});


	res.json(games);
});

app.get("/game/:gameid", async (req, res) => {
	const gameID = req.param("gameid");

	const game = await GameCache.find({ id: gameID });

	res.json(game);
});


app.listen(8080, () => {

});

const chatBot = new ChatBot();

/*
const manager = new Discord.ShardingManager("./dist/chatBot.js")
manager.spawn(1);

manager.on("launch", shard => {
	logger.info(`Launched shard ${shard.id}`)
})
*/