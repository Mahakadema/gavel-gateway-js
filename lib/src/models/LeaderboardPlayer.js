
const { classType } = require("../util.js");
const { fetchPlayer } = require("../index.js");

class LeaderboardPlayer {
    constructor(v) {
        this.name = v.name;
        this.uuid = v.uuid;

        this.rank = {
            serverRank: v.rank.toUpperCase(),
            donatorRank: v.tag === "Regular" ? null : v.tag,
            displayDonatorRank: v.displayTag,
            veteran: v.veteran
        };
        this.playtime = v.minPlayed;

        if (v.class) { // scope=SOLO
            this.class = classType(v.class.name);
            this.level = v.class.level;
            this.xp = v.class.xp;
        } else if (v.kills) { // type=PVP
            this.kills = v.kills;
        } else { // scope=TOTAL & type!=PVP
            this.level = v.level;
            this.xp = v.xp;
        }
    };

    fetch(options) {
        options ??= {};
        if (typeof options !== "object")
            throw new TypeError("options have to be valid PlayerRequestOptions");
        const copiedOptions = { ...options };
        copiedOptions.player = this.uuid;
        return fetchPlayer(copiedOptions);
    }
}

module.exports = LeaderboardPlayer;
