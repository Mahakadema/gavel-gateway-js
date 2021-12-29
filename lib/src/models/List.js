
const BaseAPIObject = require("./BaseAPIObject.js");

/**
 * Represents a list of values
 * @template T
 * @class
 */
module.exports = class List extends BaseAPIObject {
    constructor(arr, params) {
        super(params.requestTimestamp, params.timestamp, params.apiVersion, params.libVersion, params.source);

        /**
         * The entries in the list
         * @type {T[]}
         */
        this.list = arr;
    }
}
