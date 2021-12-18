
const BaseAPIObject = require("./BaseAPIObject.js");
const { bannerPattern, minecraftColor, parseBaseRequestOptions, throwErr } = require("../util.js");
const { fetchPlayer, fetchOnlinePlayers, fetchTerritoryList } = require("../index.js");

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

    fetch() {
        return fetchPlayer({ player: this.uuid });
    }
}

module.exports = class Guild extends BaseAPIObject {
    constructor(json, params) {
        super(params.requestTimestamp, json.request.timestamp * 1000);

        const a = json;

        this.name = a.name;
        this.tag = a.prefix;
        this.hasAdditionalStats = params.fetchAdditionalStats;
        this.level = a.level;
        this.xp = Math.round(a.xp * 10) / 1000;
        this.created = new Date(a.created);
        this.createdTimestamp = Date.parse(a.created);
        this.territories = params.fetchAdditionalStats ? params.territories.list.filter(v => v.guild === this.name) : a.territories;
        this.members = a.members.filter(v => v.uuid).map(v => new GuildMember(v, params.onlinePlayers, params.fetchAdditionalStats));
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
            const parsedOptions = parseBaseRequestOptions(options);
            if (!this.hasAdditionalStats) {
                const [territories, onlinePlayers] = Promise.all([
                    fetchTerritoryList(parsedOptions),
                    fetchOnlinePlayers(parsedOptions)
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
