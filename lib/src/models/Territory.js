
const territoryData = require("../../data/territories.json");
const { fetchGuild } = require("../index.js");

class Territory {
    constructor(v) {
        const terr = territoryData[v.territory.toUpperCase()] ?? territoryData._default;

        this.territory = v.territory;
        this.guild = v.guild;
        this.guildTag = v.guildPrefix ?? null;
        this.acquired = new Date(v.acquired?.replace(/ /, "T").concat(".000Z") ?? Number.NaN);
        this.acquiredTimestamp = Date.parse(v.acquired?.replace(/ /, "T").concat(".000Z") ?? Number.NaN);
        this.location = {
            x: {
                min: v.location?.startX ?? Number.NaN,
                max: v.location?.endX ?? Number.NaN
            },
            z: {
                min: v.location?.startY ?? Number.NaN,
                max: v.location?.endY ?? Number.NaN
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
