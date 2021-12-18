
const { bannerPattern, minecraftColor } = require("../util.js");
const { fetchGuild } = require("../index.js");

module.exports = class LeaderboardGuild {
    constructor(v) {
        this.name = v.name;
        this.tag = v.prefix;
        this.level = v.level;
        this.xp = v.xp;
        this.created = new Date(v.created);
        this.createdTimestamp = Date.parse(v.created);
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
        this.members = v.membersCount;
        this.territories = v.territories;
        this.warCount = v.warCount ?? 0;
    };

    fetch() {
        return fetchGuild({
            guild: this.name
        });
    }
}
