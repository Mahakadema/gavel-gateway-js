
const BaseAPIObject = require("./BaseAPIObject.js");
const { semVerFromDecimal } = require("../util.js");

const VERSION = "1.0.0";

class NameSearch extends BaseAPIObject {
    constructor(json, params) {
        super(params.requestTimestamp, json.request.timestamp * 1000 + params.timeDisparity, semVerFromDecimal(json.request.version), VERSION, params.source);

        this.guilds = json.guilds.slice();
        this.players = json.players.slice();
    };
}

module.exports = NameSearch;
