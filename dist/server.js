"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chatBot_1 = require("./chatBot");
const express = require("express");
const passport = require("passport");
const steam = require("passport-steam");
const session = require("express-session");
const mongoose = require("mongoose");
const UserModel_1 = require("./UserModel");
const util_1 = require("./util");
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
}, (identifier, profile, done) => __awaiter(this, void 0, void 0, function* () {
    profile.identifier = identifier;
    const response = yield UserModel_1.User.findOne({ steamID: profile.id });
    console.log(profile);
    if (response == null) {
        console.log("User was added to DB");
        UserModel_1.User.create({
            steamID: profile.id,
            displayName: profile.displayName,
            currentGame: profile.gameid,
            avatars: util_1.util.getAvatars(profile.photos),
            lastUpdate: +new Date() / 1000
        });
    }
    else {
        console.log("User was updated");
        yield UserModel_1.User.update({ steamID: profile.id }, {
            displayName: profile.displayName,
            avatars: util_1.util.getAvatars(profile.photos),
            currentGame: profile.gameid,
            lastUpdate: +new Date() / 1000
        });
    }
    return done(null, profile);
})));
app.use(passport.initialize());
app.use(passport.session());
app.get("/auth/steam", passport.authenticate("steam"), (req, res) => {
});
app.get("/auth/steam/return", passport.authenticate("steam", { failureRedirect: "/login" }), (req, res) => {
    res.redirect("/account");
});
app.get("/success", (req, res) => {
    res.json({ user: req.user });
});
app.get("/account", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const response = yield UserModel_1.User.findOne({ steamID: req.user.id });
    res.json(response);
}));
app.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const data = yield util_1.util.getSteamInfo("76561198070489318");
    res.json(data);
}));
app.listen(8080, () => {
    console.log("Server running");
});
const chatBot = new chatBot_1.ChatBot();
