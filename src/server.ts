import { ChatBot } from "./chatBot";
import * as express from "express";
import * as passport from "passport";
import * as steam from "passport-steam";
import * as session from "express-session";
import * as mongoose from "mongoose";

import { User } from "./UserModel"

import { util } from "./util";

require("dotenv").config();

mongoose.connect("mongodb://localhost/authbot");

const app = express();
app.use(session({
	secret: "lmaoecksdee",
	name: "auth_sess_id",
	resave: true,
	saveUninitialized: true
}));

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});


passport.use(new steam.Strategy({
	returnURL: "http://localhost:8080/auth/steam/return",
	realm: "http://localhost:8080/",
	apiKey: "277D8C52CB95A8D3FCA7FB8E513C03CC"
}, async (identifier, profile, done) => {

	profile.identifier = identifier;

	const response = await User.findOne({ steamID: profile.id });
	console.log(profile)
	if (response == null) {
		console.log("User was added to DB");
		User.create({
			steamID: profile.id,
			displayName: profile.displayName,
			currentGame: profile.gameid,
			avatars: util.getAvatars(profile.photos),
			lastUpdate: +new Date() / 1000
		});
	} else {
		console.log("User was updated")
		await User.update({ steamID: profile.id }, {
			displayName: profile.displayName,
			avatars: util.getAvatars(profile.photos),
			currentGame: profile.gameid,
			lastUpdate: +new Date() / 1000
		});
	}

	return done(null, profile);

}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/steam",
	passport.authenticate("steam"),
	(req, res) => {

	});

app.get("/auth/steam/return",
	passport.authenticate("steam", { failureRedirect: "/login" }),
	(req, res) => {
		res.redirect("/account");
	});

app.get("/success", (req, res) => {
	res.json({ user: req.user });
});

app.get("/account", async (req, res) => {
	const response = await User.findOne({ steamID: req.user.id });
	res.json(response);
});

app.get("/", async (req, res) => {
	const data = await util.getSteamInfo("76561198070489318");

	res.json(data);
});

app.listen(8080, () => {
	console.log("Server running")
});

const chatBot = new ChatBot();
