
const BaseAPIObject = require("./BaseAPIObject.js");
const { bannerPattern, minecraftColor, throwErr } = require("../util.js");
const { fetchPlayer, fetchOnlinePlayers, fetchTerritoryList } = require("../index.js");

const findWorld = (name, onlinePlayers) => onlinePlayers.list.find(v => v.players.includes(name)) ?? null;

/**
 * @typedef {"WHITE"|"LIGHT_GRAY"|"GRAY"|"BLACK"|"LIME"|"GREEN"|"CYAN"|"LIGHT_BLUE"|"BLUE"|"YELLOW"|"ORANGE"|"PINK"|"RED"|"MAGENTA"|"PURPLE"|"BROWN"} MinecraftColor A color as used by Minecraft
 * @typedef {"bs"|"ts"|"ls"|"rs"|"ms"|"cs"|"drs"|"dls"|"ss"|"cr"|"sc"|"ld"|"rud"|"lud"|"rd"|"vh"|"vhr"|"hh"|"hhb"|"bl"|"br"|"tl"|"tr"|"bt"|"tt"|"bts"|"tts"|"mc"|"mr"|"bo"|"cbo"|"bri"|"gra"|"gru"|"cre"|"sku"|"flo"|"moj"|"glb"|"pig"} BannerPattern A banner pattern as defined by Minecraft
 * @typedef {"OWNER"|"CHIEF"|"STRATEGIST"|"CAPTAIN"|"RECRUITER"|"RECRUIT"} GuildRank A rank in a guild
 */

/**
 * A banner layer with a pattern and color
 * @typedef {Object} BannerLayer
 * @property {BannerPattern} pattern The layers pattern
 * @property {MinecraftColor} color The layers color
 */

/**
 * An object containing all data for a banner
 * @typedef {Object} BannerData
 * @property {number} highestUnlockedTier The highest unlocked regular tier of the banner
 * @property {string} activeStructure The currently used banner structure
 * @property {MinecraftColor} baseColor The base color of the banner
 * @property {BannerLayer[]} layers The banner layers
 */

/**
 * Represents a member of a guild
 * @class
 */
class GuildMember {
    constructor(data, onlinePlayers, fetchAdditionalStats) {
        /**
         * The name of the guild member
         * @type {string}
         */
        this.name = data.name;
        /**
         * The uuid of the guild member
         * @type {string}
         */
        this.uuid = data.uuid;
        /**
         * The rank of the guild member
         * @type {GuildRank}
         */
        this.rank = data.rank;
        /**
         * The join date of the guild member
         * @type {Date}
         */
        this.joined = new Date(data.joined);
        /**
         * The join date of the guild member as a unix timestamp
         * @type {number}
         */
        this.joinedTimestamp = Date.parse(data.joined);
        /**
         * The amount of XP contributed by the guild member
         * @type {number}
         */
        this.xp = data.contributed;
        if (fetchAdditionalStats)
            /**
             * The current world the player is online on, if any; only set if
             * `hasAdditionalStats=true` in the request options; if two members of
             * a guild are online on the same world, this value refers to the same
             * object
             * @type {?import("./World")}
             */
            this.world = findWorld(this.name, onlinePlayers);
    }

    /**
     * Fetches the player stats of the guild member
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

/**
 * Represents a guild from the API
 * @class
 */
module.exports = class Guild extends BaseAPIObject {
    constructor(json, params) {
        super(params.requestTimestamp, json.request.timestamp * 1000 + params.timeDisparity);

        const a = json;

        /**
         * The name of the guild
         * @type {string}
         */
        this.name = a.name;
        /**
         * The tag of the guild
         * @type {string}
         */
        this.tag = a.prefix;
        /**
         * Indicates whether the object has the data returned by the
         * `fetchAdditionalStats=true` request option; used to determine whether
         * `fetchAdditionalStats()` has an effect
         * @type {boolean}
         * @readonly
         */
        this.hasAdditionalStats = params.fetchAdditionalStats;
        /**
         * The level of the guild
         * @type {number}
         */
        this.level = a.level;
        /**
         * The xp percentage of the 1.19 requirement of the guilds current level
         * as a number between 0 and 1; calculates like `current_xp /
         * requirement_1_19`; use `data.guildLevels` to
         * translate the percentages to 1.20 values or percentages
         * @type {number}
         */
        this.xp = Math.round(a.xp * 10) / 1000;
        /**
         * The creation date of the guild
         * @type {Date}
         */
        this.created = new Date(a.created);
        /**
         * The creation date of the guild as a unix timestamp
         * @type {number}
         */
        this.createdTimestamp = Date.parse(a.created);
        /**
         * The amount of territories the guild currently holds; if
         * `hasAdditionalStats=true`, this is an array of Territory objects
         * instead
         * @type {number|import("./Territory")[]}
         */
        this.territories = params.fetchAdditionalStats ? params.territories.list.filter(v => v.guild === this.name) : a.territories;
        /**
         * The members of the guild
         * @type {GuildMember[]}
         */
        this.members = a.members.filter(v => v.uuid).map(v => new GuildMember(v, params.onlinePlayers, params.fetchAdditionalStats));
        /**
         * The banner data of the guild
         * @type {BannerData}
         */
        this.banner;
        if (a.banner) {
            this.banner = {
                activeStructure: a.banner.structure ?? `tier${a.banner.tier}`,
                highestUnlockedTier: a.banner.tier,
                baseColor: minecraftColor(a.banner.base),
                layers: a.banner.layers.map(v => {
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
    };

    /**
     * Mutates the object as if the fetchAdditionalStats property was `true`
     * when this guild was requested
     * @param {import("../index").RequestOptions} [options] The options for the request
     * @returns {Promise<Guild>}
     */
    async fetchAdditionalStats(options) {
        try {
            if (!this.hasAdditionalStats) {
                const [territories, onlinePlayers] = await Promise.all([
                    fetchTerritoryList(options),
                    fetchOnlinePlayers(options)
                ]);

                this.territories = territories.list.filter(v => v.guild === this.name);
                this.members.forEach(v => v.world = findWorld(v.name, onlinePlayers))

                this.hasAdditionalStats = true;
            }
            return this;
        } catch (e) {
            throwErr(e);
        }
    }
}
