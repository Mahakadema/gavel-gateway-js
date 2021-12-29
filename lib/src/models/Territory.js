
const territoryData = require("../../data/territories.json");
const { fetchGuild } = require("../index.js");

/**
 * A rectangular area
 * @typedef {Object} SquareRegion
 * @property {import("../util").Range} x The bounds of the region on the X-axis
 * @property {import("../util").Range} z The bounds of the region on the Z-axis
 */

/**
 * A territory resource production
 * @typedef {Object} Resources
 * @property {number} emeralds The amount of emeralds the territory produces
 * @property {number} ore The amount of ore the territory produces
 * @property {number} crops The amount of crops the territory produces
 * @property {number} wood The amount of wood the territory produces
 * @property {number} fish The amount of fish the territory produces
 */

/**
 * Represents a Territory from the API
 * @class
 */
module.exports = class Territory {
    constructor(v) {
        const terr = territoryData[v.territory.toUpperCase()] ?? territoryData._default;

        /**
         * The name of the territory
         * @type {string}
         */
        this.territory = v.territory;
        /**
         * The name of the guild holding the territory; null if no guild owns
         * the territory
         * @type {?string}
         * @readonly
         */
        this.guild = v.guild;
        /**
         * The attacker of the territory; currently unused
         * @type {?string}
         */
        this.attacker = v.attacker;
        /**
         * The time the territory was acquired
         * @type {Date}
         */
        this.acquired = new Date(v.acquired.replace(/ /, "T").concat(".000Z"));
        /**
         * The time the territory was acquired as a unix timestamp
         * @type {number}
         */
        this.acquiredTimestamp = Date.parse(v.acquired.replace(/ /, "T").concat(".000Z"));
        /**
         * The location and dimensions of the territory
         * @type {SquareRegion}
         */
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

        /**
         * The amount of resources produced by the territory at base production;
         * fetched from local data
         * @type {Resources}
         */
        this.resources = {
            emeralds: terr.resources.emeralds,
            ore: terr.resources.ore,
            crops: terr.resources.crops,
            wood: terr.resources.wood,
            fish: terr.resources.fish
        };
        /**
         * The territories connected to the territory; fetched from local
         * storage
         * @type {Territory[]}
         */
        this.connections = terr.connections.slice();
    }

    /**
     * Fetches the guild stats of the owner guild
     * @param {import("../index").GuildRequestOptions} [options] The options for the request; the `guild` field has no effect
     * @returns {Promise<Guild>}
     */
    fetchOwner(options) {
        options ??= {};
        if (typeof options !== "object")
            throw new TypeError("options have to be valid GuildRequestOptions");
        const copiedOptions = { ...options };
        copiedOptions.guild = this.guild;
        return fetchGuild(copiedOptions);
    }
}
