
const { bannerPattern, minecraftColor } = require("../util.js");
const { fetchGuild } = require("../index.js");

class LeaderboardGuild {
    constructor(v) {
        this.name = v.name;
        this.tag = v.prefix;
        this.created = new Date(v.created);
        this.createdTimestamp = Date.parse(v.created);

        this.level = v.level;
        this.xp = v.xp;

        this.banner;
        if (v.banner && Object.getOwnPropertyNames(v.banner).length > 0) {
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
        this.members = v.members;
        this.territories = v.territories;
        this.warCount = v.wars ?? 0;
    };

    fetch(options) {
        options ??= {};
        if (typeof options !== "object")
            return Promise.reject(new TypeError("options have to be valid GuildRequestOptions"));
        const copiedOptions = { ...options };
        copiedOptions.guild = this.name;
        return fetchGuild(copiedOptions);
    }
}

module.exports = LeaderboardGuild;
