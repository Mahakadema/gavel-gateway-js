
const { classBaseType, classType } = require("../util.js");
const { fetchPlayer } = require("../index.js");

class LegacyLeaderboardPlayer {
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

        if (v.character) { // scope=SOLO
            this.class = {
                uuid: v.character.uuid,
                baseType: classBaseType(v.character.type.toUpperCase()),
                type: classType(v.character.type.toUpperCase())
            };
            this.level = v.character.level;
            this.xp = v.character.xp;
        } else if (v.kills >= 0) { // type=PVP
            this.kills = v.kills;
        } else { // scope=TOTAL & type!=PVP
            this.level = v.level;
            this.xp = v.xp;
        }
    };

    fetch(options) {
        return fetchPlayer({ ...options, player: this.uuid });
    }
}

module.exports = LegacyLeaderboardPlayer;
