
const BaseAPIObject = require("./BaseAPIObject.js");
const { semVerFromDecimal } = require("../util.js");

const VERSION = "1.0.0";

/**
 * Represents the sum of online players on Wynncraft
 * @class
 */
module.exports = class OnlinePlayersSum extends BaseAPIObject {
    constructor(json, params) {
        super(params.requestTimestamp, json.request.timestamp * 1000 + params.timeDisparity, semVerFromDecimal(json.request.version), VERSION, params.source);

        /**
         * The amount of players currently online on Wynncraft
         * @type {number}
         */
        this.players = json.players_online;
    };
}
