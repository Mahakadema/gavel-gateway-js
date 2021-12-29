
const { classType } = require("../util.js");
const { fetchPlayer } = require("../index.js");

/**
 * Represents a player in a leaderboard from the API
 * @class
 */
module.exports = class LeaderboardPlayer {
    constructor(v) {
        /**
         * The account name of the player
         * @type {string}
         */
        this.name = v.name;
        /**
         * The UUID of the player
         * @type {string}
         * @readonly
         */
        this.uuid = v.uuid;

        /**
         * The rank information of the player; the `displayTag` and `veteran`
         * properties are currently always false, unless both are true
         * @type {import("./Player").RankData}
         */
        this.rank = {
            serverRank: v.rank.toUpperCase(),
            donatorRank: v.tag === "Regular" ? null : v.tag,
            displayDonatorRank: v.displayTag,
            veteran: v.veteran
        };
        /**
         * The playtime of the player
         * @type {number}
         */
        this.playtime = v.minPlayed;

        if (v.class) { // scope=SOLO
            /**
             * The ClassType that earns the player their spot on the leaderboard;
             * only set if the requested scope was `SOLO`
             * @type {?import("./Player").ClassType}
             */
            this.class = classType(v.class.name);
            /**
             * The respective level of the player; only set if the type of the
             * request wasn't `PVP`
             * @type {?number}
             */
            this.level = v.class.level;
            /**
             * The additional XP the player has gathered beyond their current level;
             * only set if the type of the request wasn't `PVP`
             * @type {?number}
             */
            this.xp = v.class.xp;
        } else if (v.kills) { // type=PVP
            /**
             * The nether kills of the player; only set if the type of the request
             * was `PVP`
             * @type {?number}
             */
            this.kills = v.kills;
        } else { // scope=TOTAL & type!=PVP
            // documented above already
            this.level = v.level;
            this.xp = v.xp;
        }
    };

    /**
     * Fetches the player stats of the player
     * @param {import("../index").PlayerRequestOptions} [options] The options for the request; the `player` field has no effect
     * @returns {Promise<Player>}
     */
    fetch(options) {
        options ??= {};
        if (typeof options !== "object")
            throw new TypeError("options have to be valid PlayerRequestOptions");
        const copiedOptions = { ...options };
        copiedOptions.player = this.uuid;
        return fetchPlayer(copiedOptions);
    }
}
