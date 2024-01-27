
const BaseAPIObject = require("./BaseAPIObject.js");
const GuildMember = require("./GuildMember.js");
const { bannerPattern, minecraftColor, semVerFromDecimal, semVerFromHeader } = require("../util.js");
const { fetchOnlinePlayers, fetchTerritoryList } = require("../index.js");
const guildLevels = require("../../data/guildLevels.json");
const guildLevelRewards = require("../../data/guildLevelRewards.json");

const VERSION = "2.1.0";

const findWorld = (name, onlinePlayers) => onlinePlayers.list.find(v => v.players.includes(name)) ?? null;

class Guild extends BaseAPIObject {
    constructor(rawResult, params) {
        super(rawResult.requestedAt, rawResult.respondedAt, rawResult.receivedAt, rawResult.dataTimestamp, semVerFromHeader(rawResult.headers["version"]), rawResult.body.uuid ? VERSION : "2.0.0", params.source);

        const a = rawResult.body;

        if (a.uuid)
            this.uuid = a.uuid;
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
        this.created = new Date(a.created);
        this.createdTimestamp = Date.parse(a.created);
        this.territories = params.fetchAdditionalStats ? params.territories.list.filter(v => v.guild === this.name) : a.territories;
        this.members = ["owner", "chief", "strategist", "captain", "recruiter", "recruit"]
            .flatMap(rank => Object.getOwnPropertyNames(a.members[rank])
                .map(uuid => new GuildMember(uuid, a.members[rank][uuid], rank))
            )
            .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);
        this.memberSlots = guildLevelRewards.filter(v => v.type === "MEMBER_SLOTS" && v.level <= a.level).reduce((p, c) => p + c.value, 0);
        this.onlineMembers = a.online;
        this.seasonRanks = Object.getOwnPropertyNames(a.seasonRanks).map(v => ({
            season: Number(v),
            rating: a.seasonRanks[v].rating,
            finalTerritories: a.seasonRanks[v].finalTerritories
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
            const territories = await fetchTerritoryList(options);

            this.territories = territories.list.filter(v => v.guild === this.name);

            this.hasAdditionalStats = true;
        }
        return this;
    }
}

module.exports = Guild;
