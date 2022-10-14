
const BaseAPIObject = require("./BaseAPIObject.js");

const VERSION = "1.0.0";

class UUID extends BaseAPIObject {
    constructor(json, params) {
        super(params.requestTimestamp, json.timestamp + params.timeDisparity, json.version, VERSION, params.source);

        this.uuid = json.data[0].uuid;
        this.name = json.data[0].name;
    };
}

module.exports = UUID;
