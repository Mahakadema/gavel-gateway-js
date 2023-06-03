
const { fetchGuild } = require("../index.js");

class Territory {
    constructor(terrData, apiTerr) {
        this.territory = apiTerr?.territory ?? terrData.name;
        this.guild = apiTerr?.guild ?? null;
        this.guildTag = apiTerr?.guildPrefix ?? null;
        const acquired = apiTerr?.acquired?.replace(/ /, "T").concat(".000Z") ?? Number.NaN;
        this.acquired = new Date(acquired);
        this.acquiredTimestamp = Date.parse(acquired);
        this.location = {
            x: {
                min: apiTerr?.location?.startX ?? terrData.location.startX ?? Number.NaN,
                max: apiTerr?.location?.endX ?? terrData.location.endX ?? Number.NaN
            },
            z: {
                min: apiTerr?.location?.startY ?? terrData.location.startY ?? Number.NaN,
                max: apiTerr?.location?.endY ?? terrData.location.endY ?? Number.NaN
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
        options ??= {};
        if (typeof options !== "object")
            throw new TypeError("options have to be valid GuildRequestOptions");
        const copiedOptions = { ...options };
        copiedOptions.guild = this.guild;
        return fetchGuild(copiedOptions);
    }
}

module.exports = Territory;
