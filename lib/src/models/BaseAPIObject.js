
/**
 * Represents the basis of all objects returned by API requests
 * @class
 */
module.exports = class BaseAPIObject {
    constructor (requestTimestamp, timestamp, apiVersion, libVersion, source) {
        /**
         * The unix timestamp indicating when this request started executing
         * @type {number}
         */
        this.requestedAt = requestTimestamp;
        /**
         * The unix timestamp indicating when the data of this request was last
         * updated; note that this timestamp does not indicate when the data was
         * created, just when it was last synced to the currently requested API
         * node. The PvP leaderboard, for instance, update once per hour, yet this
         * timestamp updates approximately once every 30 seconds for PvP
         * leaderboard routes.
         * @type {number}
         */
        this.timestamp = timestamp;
        /**
         * The version of the requested API route
         * @type {import("../util").SemanticVersion}
         */
        this.apiVersion = apiVersion;
        /**
         * The version of the representation of the data by the wrapper
         * @type {import("../util").SemanticVersion}
         */
        this.libVersion = libVersion;
        /**
         * The route used to request the data for this object; cache entries
         * are identified by this route URL
         * @type {import("../util").WynncraftAPIRoute}
         */
        this.source = source;
    }
}