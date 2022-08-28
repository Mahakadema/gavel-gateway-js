
const BaseAPIObject = require("./BaseAPIObject.js");
const { bannerPattern, minecraftColor, semVerFromDecimal, throwErr } = require("../util.js");
const { fetchPlayer, fetchOnlinePlayers, fetchTerritoryList } = require("../index.js");
const guildLevels = require("../../data/guildLevels.json");

const VERSION = "1.0.0";

const findWorld = (name, onlinePlayers) => onlinePlayers.list.find(v => v.players.includes(name)) ?? null;

class GuildMember {
    constructor(data, onlinePlayers, fetchAdditionalStats) {
        this.name = data.name;
        this.uuid = data.uuid;
        this.rank = data.rank;
        this.joined = new Date(data.joined);
        this.joinedTimestamp = Date.parse(data.joined);
        this.xp = data.contributed;
        if (fetchAdditionalStats)
            this.world = findWorld(this.name, onlinePlayers);
    }

    fetch(options) {
        options ??= {};
        if (typeof options !== "object")
            throw new TypeError("options have to be valid PlayerRequestOptions");
        const copiedOptions = { ...options };
        copiedOptions.player = this.uuid;
        return fetchPlayer(copiedOptions);
    }
}

class Guild extends BaseAPIObject {
    constructor(json, params) {
        super(params.requestTimestamp, json.request.timestamp * 1000 + params.timeDisparity, semVerFromDecimal(json.request.version), VERSION, params.source);

        const a = json;

        this.name = a.name;
        this.tag = a.prefix;
        this.hasAdditionalStats = params.fetchAdditionalStats;
        this.level = a.level;
        this.xp = Math.round(a.xp * 10) / 1000;
        this.xpFriendly = {
            isSafe: a.level < guildLevels.length,
            maxErrorLower: null,
            maxErrorUpper: null,
            xpPct: null,
            xpRaw: null,
            required: null
        };
        if (this.xpFriendly.isSafe) {
            this.xpFriendly.maxErrorLower = 1;
            this.xpFriendly.maxErrorUpper = 1 + 1 / a.xp; // error due to xp being truncated
            this.xpFriendly.xpPct = a.xp / 100;
            this.xpFriendly.xpRaw = Math.round(a.xp * guildLevels[a.level].postGavelReborn / 100);
            this.xpFriendly.required = guildLevels[a.level].postGavelReborn;
        }
        this.created = new Date(a.created);
        this.createdTimestamp = Date.parse(a.created);
        this.territories = params.fetchAdditionalStats ? params.territories.list.filter(v => v.guild === this.name) : a.territories;
        this.members = a.members.filter(v => v.uuid).map(v => new GuildMember(v, params.onlinePlayers, params.fetchAdditionalStats));
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

module.exports = Guild;
