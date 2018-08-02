"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
class ChatBot {
    constructor() {
        console.log("LOADING CHAT BOT");
        this.client = new Discord.Client();
        this.client.login(process.env.DISCORD_BOT_TOKEN);
        this.client.on("ready", this.ready);
        this.client.on("message", this.onMessage);
    }
    ready() {
        console.log("Bot is ready");
    }
    onMessage(msg) {
        if (msg.content === '!verify') {
            msg.author.sendMessage("Please click this link to register: http://localhost:8080/auth/steam");
        }
        if (msg.content === '!games') {
            const embed = new Discord.RichEmbed({
                color: 3447003,
                title: "League of Legends",
                description: "200/5000 players"
            });
            for (let i = 0; i < 3; i++) {
                msg.channel.sendEmbed(embed);
            }
        }
    }
}
exports.ChatBot = ChatBot;
