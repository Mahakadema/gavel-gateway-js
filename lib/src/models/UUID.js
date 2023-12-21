
const BaseAPIObject = require("./BaseAPIObject.js");
const { fetchPlayer } = require("../index.js");
const { semVerFromHeader } = require("../util.js");

const VERSION = "1.1.0";

class UUID extends BaseAPIObject {
    constructor(rawResult, params) {
        super(rawResult.requestedAt, rawResult.respondedAt, rawResult.receivedAt, rawResult.body.timestamp, rawResult.body.version, VERSION, params.source);

        this.uuid = rawResult.body.data[0].uuid;
        this.name = rawResult.body.data[0].name;
    };

    fetch(options) {
        options ??= {};
        if (typeof options !== "object")
            return Promise.reject(new TypeError("options have to be valid PlayerRequestOptions"));
        const copiedOptions = { ...options };
        copiedOptions.player = this.uuid;
        return fetchPlayer(copiedOptions);
    }
}

module.exports = UUID;
