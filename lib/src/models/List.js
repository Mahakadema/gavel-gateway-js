
const BaseAPIObject = require("./BaseAPIObject.js");

module.exports = class List extends BaseAPIObject {
    constructor(arr, params) {
        super(params.requestTimestamp, params.timestamp);

        this.list = arr;
    }
}
