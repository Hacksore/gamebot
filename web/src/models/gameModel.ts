import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const GameSchema = new Schema({
	userID: {
		type: String,
		unique: true
	},
	gameID: Number,
	game: Object
});

const Game = mongoose.model("Game", GameSchema);

export { Game }; 