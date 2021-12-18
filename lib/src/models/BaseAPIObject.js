
module.exports = class BaseAPIObject {
    constructor (requestTimestamp, timestamp) {
        this.requestedAt = requestTimestamp;
        this.timestamp = timestamp;
    }
}