import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const GameSchema = new Schema({
	guild: String,
	games: Object
});

const Game = mongoose.model("Game", GameSchema);

export { Game }; 