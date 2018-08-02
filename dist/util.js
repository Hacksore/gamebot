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
const rp = require("request-promise");
class util {
    static getSteamInfo(steamID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield rp.get({
                url: `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${this.API_KEY}&steamids=${steamID}`,
                json: true
            });
        });
    }
    static getSteamInfoBatch(list) {
        return __awaiter(this, void 0, void 0, function* () {
            const lookup = list.join(",");
            return yield rp.get({
                url: `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${this.API_KEY}&steamids=${lookup}`,
                json: true
            });
        });
    }
    static getAvatars(array) {
        return {
            "small": array[0].value,
            "medium": array[1].value,
            "large": array[2].value
        };
    }
}
util.API_KEY = process.env.STEAM_API_KEY;
exports.util = util;
