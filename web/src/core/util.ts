
import * as rp from "request-promise";

class util {

	static API_KEY: String = process.env.STEAM_API_KEY;
	static async getSteamInfo(steamID: string) {
		return await rp.get({
			url: `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${this.API_KEY}&steamids=${steamID}`,
			json: true
		})
	}
	static async getSteamInfoBatch(list: Array<String>) {
		const lookup = list.join(",");
		return await rp.get({
			url: `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${this.API_KEY}&steamids=${lookup}`,
			json: true
		})
	}

	static getAvatars(array) {
		return {
			"small": array[0].value,
			"medium": array[1].value,
			"large": array[2].value
		}
	}
}


export { util }