
import * as rp from "request-promise";

require("dotenv").config();

class util {

	static API_KEY: String = process.env.GB_API_KEY;

	static async getGameInfo(game: String) {
		return await rp.get({
			url: `https://www.giantbomb.com/api/search/?api_key=${this.API_KEY}&format=json&query=${game}&resources=game&limit=1`,
			json: true,
			headers: { "User-Agent": "A discord bot that reads the API" }
		})
	}
}


export { util }