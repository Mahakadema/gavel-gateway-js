
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
                min: terr.location.startX,
                max: terr.location.endX
            },
            z: {
                min: terr.location.startZ,
                max: terr.location.endZ
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
