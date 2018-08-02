import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	steamID: {
		type: String,
		unique: true
	},
	displayName: {
		type: String
	},
	games: Array,
	currentGame: String,
	avatars: Object,
	lastSeen: Number,
	lastUpdate: Number
});

const User = mongoose.model("User", UserSchema);

export { User }; 