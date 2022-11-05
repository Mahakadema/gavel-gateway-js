
class BaseAPIObject {
    constructor (requestTimestamp, responseTimestamp, timestamp, apiVersion, libVersion, source) {

        this.requestedAt = requestTimestamp;
        this.respondedAt = responseTimestamp;
        this.timestamp = timestamp;
        this.apiVersion = apiVersion;
        this.libVersion = libVersion;
        this.source = source;
    }
}

module.exports = BaseAPIObject;
