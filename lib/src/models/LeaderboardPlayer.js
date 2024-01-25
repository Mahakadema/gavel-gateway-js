
const { classBaseType, classType, CDN_URL } = require("../util.js");
const { fetchPlayer, fetchPlayerCharacterAbilityTree } = require("../index.js");

class LeaderboardPlayer {
    constructor(v, type) {
        this.uuid = v.uuid;
        this.name = v.name;

        this.score = v.score;

        this.playtime = v.metadata.playtime;
        this.xp = v.metadata.xp ?? null; // Missing on <raid>Completion
        this.level = v.metadata.totalLevel ?? (type.endsWith("Level") ? v.score : null); // only present on playerContent, will be null on some content LBs

        if (v.characterUuid) {
            this.character = {
                uuid: v.characterUuid,
                type: classType(v.characterType.toUpperCase()),
                baseType: classBaseType(v.characterType.toUpperCase()),
                nickname: v.nickname ?? null
            };
        }

        this.rank = {
            serverRank: v.rank.toUpperCase(),
            shortenedServerRank: v.shortenedRank ?? v.rank,
            donatorRank: v.supportRank?.toUpperCase().replace("VIPPLUS", "VIP+") ?? null,
            veteran: v.veteran ?? false,
            textColor: v.legacyRankColour ? v.legacyRankColour.main : null,
            backgroundColor: v.legacyRankColour ? v.legacyRankColour.sub : null,
            badgeUrl: v.rankBadge ? CDN_URL + v.rankBadge : null
        };
    };

    fetch(options) {
        options ??= {};
        if (typeof options !== "object") // TODO: fix bad code
            throw new TypeError("options have to be valid PlayerRequestOptions");
        const copiedOptions = { ...options };
        copiedOptions.player = this.uuid;
        return fetchPlayer(copiedOptions);
    }

    fetchCharacterAbilityTree(options = {}) {
        if (!this.character)
            return Promise.reject(new Error("This leaderboard is missing character info"));
        return fetchPlayerCharacterAbilityTree({ ...options, player: this.uuid, character: this.character.uuid, class: this.character.type });
    }
}

module.exports = LeaderboardPlayer;
