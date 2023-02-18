
const BaseAPIObject = require("./BaseAPIObject.js");
const PlayerPartyMember = require("./PlayerPartyMember.js");
const { semVerFromDecimal } = require("../util.js");

const VERSION = "1.1.0";

class PlayerParty extends BaseAPIObject {
    constructor(json, params) {
        super(params.requestTimestamp, json.currentTimestamp, json.timestamp * 1000, semVerFromDecimal(1), VERSION, params.source);

        this.world = json.server;
        this.self = new PlayerPartyMember(json.name, json.uuid, json.x, json.y, json.z, json.maxHealth, json.health);
        this.party = json.party.map(v => new PlayerPartyMember(v.name, v.uuid, v.x, v.y, v.z, v.maxHealth, v.health));
    };
}

module.exports = PlayerParty;
