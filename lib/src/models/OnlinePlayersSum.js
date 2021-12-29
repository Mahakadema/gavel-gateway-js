
const BaseAPIObject = require("./BaseAPIObject.js");

/**
 * Represents the sum of online players on Wynncraft
 * @class
 */
module.exports = class OnlinePlayersSum extends BaseAPIObject {
    constructor(json, params) {
        super(params.requestTimestamp, json.request.timestamp * 1000 + params.timeDisparity);

        /**
         * The amount of players currently online on Wynncraft
         * @type {number}
         */
        this.players = json.players_online;
    };
}
