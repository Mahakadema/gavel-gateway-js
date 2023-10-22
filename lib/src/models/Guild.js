
const BaseAPIObject = require("./BaseAPIObject.js");
const GuildMember = require("./GuildMember.js");
const { bannerPattern, minecraftColor, semVerFromDecimal } = require("../util.js");
const { fetchOnlinePlayers, fetchTerritoryList } = require("../index.js");
const guildLevels = require("../../data/guildLevels.json");
const guildLevelRewards = require("../../data/guildLevelRewards.json");

const VERSION = "1.2.0";

const findWorld = (name, onlinePlayers) => onlinePlayers.list.find(v => v.players.includes(name)) ?? null;

class Guild extends BaseAPIObject {
    constructor(json, params) {
        super(params.requestTimestamp, json.currentTimestamp, json.timestamp * 1000, semVerFromDecimal(json.version), VERSION, params.source);

        const a = json;

        this.name = a.name;
        this.tag = a.prefix;
        this.stars = guildLevelRewards.filter(v => v.type === "GUILD_STARS" && v.level <= a.level).reduce((p, c) => p + c.value, 0);
        this.hasAdditionalStats = params.fetchAdditionalStats;
        this.level = a.level;
        this.levelProgression = Math.min(1, Math.max(0, Math.round(a.xpPercent) / 100));
        this.xp = Math.round(a.xpPercent) / 100;
        this.xpRaw = Math.round(guildLevels[a.level].requirement * this.levelProgression);
        this.xpRawLower = Math.ceil(guildLevels[a.level].requirement * Math.max(0, Math.round(this.levelProgression * 1000) - 5) / 1000);
        this.xpRawUpper = Math.max(0, Math.ceil(guildLevels[a.level].requirement * Math.min(1000, Math.round(this.levelProgression * 1000) + 5) / 1000) - 1);
        this.xpRequired = guildLevels[a.level].requirement;
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
            this.xpFriendly.maxErrorUpper = 1 + 1 / a.xpPercent; // error due to xpPercent being truncated
            this.xpFriendly.xpPct = a.xpPercent / 100;
            this.xpFriendly.xpRaw = Math.round(a.xpPercent * guildLevels[a.level].postGavelReborn / 100);
            this.xpFriendly.required = guildLevels[a.level].postGavelReborn;
        }
        this.created = new Date(a.created + "Z");
        this.createdTimestamp = Date.parse(a.created + "Z");
        this.territories = params.fetchAdditionalStats ? params.territories.list.filter(v => v.guild === this.name) : a.territories;
        this.members = ["owner", "chief", "strategist", "captain", "recruiter", "recruit"]
            .flatMap(rank => Object.getOwnPropertyNames(a.members[rank])
                .map(v => new GuildMember(v, a.members[rank][v], rank, params.onlinePlayers, params.fetchAdditionalStats, params.usesUUIDs))
            )
            .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);
        this.memberSlots = guildLevelRewards.filter(v => v.type === "MEMBER_SLOTS" && v.level <= a.level).reduce((p, c) => p + c.value, 0);
        // TODO: docs (2)
        this.onlineMembers = a.online;
        this.seasonRank = Object.getOwnPropertyNames(a.seasonRanks).map(v => ({
            number: Number(v),
            rating: a.seasonRank[v].rating,
            finalTerritories: a.seasonRank[v].finalTerritories
        }));
        this.banner = {
            activeStructure: `tier1`,
            highestUnlockedTier: 1,
            baseColor: "WHITE",
            layers: []
        };
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
        }
    };

    async fetchAdditionalStats(options) {
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
    }
}

module.exports = Guild;
