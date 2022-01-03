
const territoryData = require("../../data/territories.json");
const { fetchGuild } = require("../index.js");

class Territory {
    constructor(v) {
        const terr = territoryData[v.territory.toUpperCase()] ?? territoryData._default;

        this.territory = v.territory;
        this.guild = v.guild;
        this.attacker = v.attacker;
        this.acquired = new Date(v.acquired.replace(/ /, "T").concat(".000Z"));
        this.acquiredTimestamp = Date.parse(v.acquired.replace(/ /, "T").concat(".000Z"));
        this.location = {
            x: {
                min: Math.min(v.location.startX, v.location.endX),
                max: Math.max(v.location.startX, v.location.endX)
            },
            z: {
                min: Math.min(v.location.startY, v.location.endY),
                max: Math.max(v.location.startY, v.location.endY)
            }
        };

        this.resources = {
            emeralds: terr.resources.emeralds,
            ore: terr.resources.ore,
            crops: terr.resources.crops,
            wood: terr.resources.wood,
            fish: terr.resources.fish
        };
        this.connections = terr.connections.slice();
    }

    fetchOwner(options) {
        options ??= {};
        if (typeof options !== "object")
            throw new TypeError("options have to be valid GuildRequestOptions");
        const copiedOptions = { ...options };
        copiedOptions.guild = this.guild;
        return fetchGuild(copiedOptions);
    }
}

module.exports = Territory;
