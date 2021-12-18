
const BaseAPIObject = require("./BaseAPIObject.js");

module.exports = class OnlinePlayersSum extends BaseAPIObject {
    constructor(json, params) {
        super(params.requestTimestamp, json.request.timestamp * 1000);

        this.players = json.players_online;
    };
}
