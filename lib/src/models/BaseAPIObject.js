
class BaseAPIObject {
    constructor (requestTimestamp, timestamp, apiVersion, libVersion, source) {

        this.requestedAt = requestTimestamp;
        this.timestamp = timestamp;
        this.apiVersion = apiVersion;
        this.libVersion = libVersion;
        this.source = source;
    }
}

module.exports = BaseAPIObject;
