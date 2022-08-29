
const BaseAPIObject = require("./BaseAPIObject.js");
const { semVerFromDecimal } = require("../util.js");
const { fetchPlayer } = require("../index.js");

const VERSION = "1.0.0";

class PlayerPartyMember {
    constructor(name, uuid, x, y, z, maxHealth, health) {
        this.name = name;
        this.uuid = uuid;
        this.x = x;
        this.y = y;
        this.z = z;
        this.maxHealth = maxHealth;
        this.health = health;
    }

    fetch(options) {
        options ??= {};
        if (typeof options !== "object")
            throw new TypeError("options have to be valid PlayerRequestOptions");
        const copiedOptions = { ...options };
        copiedOptions.player = this.uuid;
        return fetchPlayer(copiedOptions);
    }
}

class PlayerParty extends BaseAPIObject {
    constructor(json, params) {
        super(params.requestTimestamp, json.timestamp * 1000 + params.timeDisparity, semVerFromDecimal(1), VERSION, params.source);

        this.world = json.server;
        this.self = new PlayerPartyMember(json.name, json.uuid, json.x, json.y, json.z, json.maxHealth, json.health);
        this.party = json.party.map(v => new PlayerPartyMember(v.name, v.uuid, v.x, v.y, v.z, v.maxHealth, v.health));
    };
}

module.exports = PlayerParty;
