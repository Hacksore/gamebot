import * as Discord from "discord.js";
import { Game } from "./models/gameModel"
class ChatBot {

	public client: Discord.Client;

	constructor() {
		this.client = new Discord.Client();

		this.client.login(process.env.DISCORD_BOT_TOKEN);

		this.client.on("ready", this.ready.bind(this));
		this.client.on("message", this.onMessage.bind(this));
		this.client.on("guildUpdate", this.onGuildUpdate.bind(this))
	}

	onGuildUpdate() {
		console.log(this.client.guilds)
	}

	async ready() {
		console.log("ChatBot is ready")


		this.client.guilds.forEach(async guild => {
			const users = await guild.fetchMembers();
			users.presences.forEach((pres, id) => {
				if (pres.status === "online") {
					console.log(pres)
				}
			});

		})
	}

	async onMessage(msg: Discord.Message) {
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

		if (msg.content === '!test') {
			const game = msg.author.presence.game;
			console.log(game);
			msg.author.send("Playing: " + game);
		}

		if (msg.content === '!users') {
			if (msg.guild === null) {
				return console.log("dm");
			}

			const users = await msg.guild.fetchMembers();
			const games = {};

			users.presences.forEach(async (pres, id) => {
				const userData = msg.author.client.users.get(id);
				const game = pres.game;
				if (game !== null && !userData.bot) {
					if (games[game.name] === undefined) {
						games[game.name] = [];
					}

					games[game.name].push({
						clientData: {
							name: userData.username,
							avatar: userData.avatarURL
						},
						gameData: {
							name: game.name,
							streaming: game.streaming
						}
					});
				}

			});

			Game.create({
				guild: msg.guild.id,
				games: games
			});

			msg.channel.sendCode("javascript", JSON.stringify(games, null, 2));
		}

	}


}

export { ChatBot }