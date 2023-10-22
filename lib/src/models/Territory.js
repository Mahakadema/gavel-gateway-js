
const { fetchGuild } = require("../index.js");

class Territory {
    constructor(terrData, apiTerr) {
        this.territory = apiTerr?.territory ?? terrData.name;
        this.guild = apiTerr?.guild.name ?? null;
        this.guildTag = apiTerr?.guild.prefix ?? null;
        const acquired = apiTerr?.acquired.concat("Z") ?? Number.NaN;
        this.acquired = new Date(acquired);
        this.acquiredTimestamp = Date.parse(acquired);
        this.location = {
            x: {
                min: apiTerr?.location.start[0] ?? terrData.location.startX ?? Number.NaN,
                max: apiTerr?.location.end[0] ?? terrData.location.endX ?? Number.NaN
            },
            z: {
                min: apiTerr?.location.start[1] ?? terrData.location.startY ?? Number.NaN,
                max: apiTerr?.location.end[1] ?? terrData.location.endY ?? Number.NaN
            }
        };

        this.resources = {
            emeralds: terrData.resources.emeralds,
            ore: terrData.resources.ore,
            crops: terrData.resources.crops,
            wood: terrData.resources.wood,
            fish: terrData.resources.fish
        };
        this.connections = terrData.connections.slice();
    }

    fetchOwner(options) {
        // TODO: bad coding
        options ??= {};
        if (typeof options !== "object")
            throw new TypeError("options have to be valid GuildRequestOptions");
        const copiedOptions = { ...options };
        copiedOptions.guild = this.guild;
        return fetchGuild(copiedOptions);
    }
}

module.exports = Territory;
