import { ChatBot } from "./chatBot";
import * as express from "express";
import * as mongoose from "mongoose";

import { util } from "./util";

require("dotenv").config();

mongoose.connect("mongodb://localhost:27017/gamebot", {
	useNewUrlParser: true
});

const app = express();
app.get("/", async (req, res) => {
	const data = await util.getSteamInfo("76561198070489318");

	res.json(data);
});

app.listen(8080, () => {

});

const chatBot = new ChatBot();
