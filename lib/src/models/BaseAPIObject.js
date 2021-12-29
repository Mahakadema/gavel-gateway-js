
/**
 * Represents the basis of all objects returned by API requests
 * @class
 */
module.exports = class BaseAPIObject {
    constructor (requestTimestamp, timestamp) {
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
    }
}