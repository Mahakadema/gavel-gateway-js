
const BaseAPIObject = require("./BaseAPIObject.js");

class List extends BaseAPIObject {
    constructor(arr, params) {
        super(params.requestedAt, params.respondedAt, params.receivedAt, params.timestamp, params.apiVersion, params.libVersion, params.source);

        this.list = arr;
    }
}

module.exports = List;
