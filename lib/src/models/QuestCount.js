
const BaseAPIObject = require("./BaseAPIObject.js");
const { semVerFromHeader } = require("../util.js");

const VERSION = "1.0.0";

class QuestCount extends BaseAPIObject {
    constructor(rawResult, params) {
        super(rawResult.requestedAt, rawResult.respondedAt, rawResult.receivedAt, rawResult.dataTimestamp, semVerFromHeader(rawResult.headers["version"]), VERSION, params.source);

        this.quests = rawResult.body.quests;
    };
}

module.exports = QuestCount;
