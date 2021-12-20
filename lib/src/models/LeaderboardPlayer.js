
const { classType } = require("../util.js");
const { fetchPlayer } = require("../index.js");

module.exports = class LeaderboardPlayer {
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

    fetchPlayer() {
        return fetchPlayer({
            player: this.uuid
        });
    }
}
