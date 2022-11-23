
class BaseAPIObject {
    constructor (requestTimestamp, responseTimestamp, timestamp, apiVersion, libVersion, source) {

        this.source = source;
        this.apiVersion = apiVersion;
        this.libVersion = libVersion;
        this.requestedAt = requestTimestamp;
        this.respondedAt = responseTimestamp;
        this.timestamp = timestamp;
    }
}

module.exports = BaseAPIObject;
