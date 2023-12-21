
class BaseAPIObject {
    constructor (requestedAt, respondedAt, receivedAt, dataTimestamp, apiVersion, libVersion, source) {

        this.source = source;
        this.apiVersion = apiVersion;
        this.libVersion = libVersion;
        this.requestedAt = requestedAt;
        this.respondedAt = respondedAt;
        this.receivedAt = receivedAt;
        this.timestamp = dataTimestamp;
    }
}

module.exports = BaseAPIObject;
