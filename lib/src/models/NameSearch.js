
const BaseAPIObject = require("./BaseAPIObject.js");
const { semVerFromDecimal } = require("../util.js");

const VERSION = "1.0.0";

/**
 * Represents the result of a name search on the Wynncraft API
 * @class
 */
module.exports = class NameSearch extends BaseAPIObject {
    constructor(json, params) {
        super(params.requestTimestamp, json.request.timestamp * 1000 + params.timeDisparity, semVerFromDecimal(json.request.version), VERSION, params.source);

        /**
         * The guild names including the search pattern in their name;
         * case-insensitive; ordered in ascending order of creation date
         * @type {string[]}
         */
        this.guilds = json.guilds.slice();
        /**
         * The player names matching the search query; case-insensitive;
         * ordered in descending order of first join date; it is not clear
         * how exactly the search matches players, but most names require
         * a near exact match
         * @type {string[]}
         */
        this.players = json.players.slice();
    };
}
