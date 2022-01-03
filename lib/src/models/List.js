
const BaseAPIObject = require("./BaseAPIObject.js");

class List extends BaseAPIObject {
    constructor(arr, params) {
        super(params.requestTimestamp, params.timestamp, params.apiVersion, params.libVersion, params.source);

        this.list = arr;
    }
}

module.exports = List;
