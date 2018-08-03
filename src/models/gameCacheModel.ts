import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const GameCacheSchema = new Schema({
	id: {
		type: Number,
		unique: true
	},
	name: {
		type: String,
		unique: true,
	},
	cover: Object
});

const GameCache = mongoose.model("GameCache", GameCacheSchema);

export { GameCache }; 