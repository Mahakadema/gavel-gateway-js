
const { bannerPattern, minecraftColor } = require("../util.js");
const { fetchGuild } = require("../index.js");

/**
 * Represents a guild in a leaderboard from the API
 * @class
 */
module.exports = class LeaderboardGuild {
    constructor(v) {
        /**
         * The name of the guild
         * @type {string}
         * @readonly
         */
        this.name = v.name;
        /**
         * The tag of the guild
         * @type {string}
         */
        this.tag = v.prefix;
        /**
         * The creation time of the guild
         * @type {Date}
         */
        this.created = new Date(v.created);
        /**
         * The creation time of the guild as a unix timestamp
         * @type {number}
         */
        this.createdTimestamp = Date.parse(v.created);

        /**
         * The level of the guild
         * @type {number}
         */
        this.level = v.level;
        /**
         * The current raw xp of the guild
         * @type {number}
         */
        this.xp = v.xp;

        /**
         * The banner of the guild
         * @type {import("./Guild").BannerData}
         */
        this.banner;
        if (v.banner) {
            this.banner = {
                activeStructure: v.banner.structure ?? `tier${v.banner.tier}`,
                highestUnlockedTier: v.banner.tier,
                baseColor: minecraftColor(v.banner.base),
                layers: v.banner.layers.map(v => {
                    return {
                        color: minecraftColor(v.colour),
                        pattern: bannerPattern(v.pattern)
                    };
                })
            };
        } else {
            this.banner = {
                activeStructure: `tier1`,
                highestUnlockedTier: 1,
                baseColor: "WHITE",
                layers: []
            };
        }
        /**
         * The member count of the guild
         * @type {number}
         */
        this.members = v.membersCount;
        /**
         * The territory count of the guild
         * @type {number}
         */
        this.territories = v.territories;
        /**
         * The war count of the guild; counts all war attempts
         * @type {number}
         */
        this.warCount = v.warCount ?? 0;
    };

    /**
     * Fetches the stats of the guild
     * @param {import("../index").GuildRequestOptions} [options] The options for the request; the `guild` field has no effect
     * @returns {Promise<Guild>}
     */
    fetch(options) {
        options ??= {};
        if (typeof options !== "object")
            throw new TypeError("options have to be valid GuildRequestOptions");
        const copiedOptions = { ...options };
        copiedOptions.guild = this.name;
        return fetchGuild(copiedOptions);
    }
}
