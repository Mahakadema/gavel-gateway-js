
const BaseAPIObject = require("./BaseAPIObject.js");
const { fetchPlayer } = require("../index.js");

const VERSION = "1.0.0";

class UUID extends BaseAPIObject {
    constructor(json, params) {
        super(params.requestTimestamp, json.timestamp + params.timeDisparity, json.version, VERSION, params.source);

        this.uuid = json.data[0].uuid;
        this.name = json.data[0].name;
    };

    fetch(options) {
        options ??= {};
        if (typeof options !== "object")
            throw new TypeError("options have to be valid PlayerRequestOptions");
        const copiedOptions = { ...options };
        copiedOptions.player = this.uuid;
        return fetchPlayer(copiedOptions);
    }
}

module.exports = UUID;
