
const BaseAPIObject = require("./BaseAPIObject.js");
const { semVerFromDecimal, semVerFromHeader } = require("../util.js");

const VERSION = "1.1.0";

class OnlinePlayersSum extends BaseAPIObject {
    constructor(rawResult, params) {
        super(rawResult.requestedAt, rawResult.respondedAt, rawResult.receivedAt, rawResult.dataTimestamp, semVerFromHeader(rawResult.headers["version"]), VERSION, params.source);

        this.players = rawResult.body.total;
    };
}

module.exports = OnlinePlayersSum;
