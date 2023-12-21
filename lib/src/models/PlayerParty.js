
const BaseAPIObject = require("./BaseAPIObject.js");
const PlayerPartyMember = require("./PlayerPartyMember.js");
const { semVerFromDecimal, semVerFromHeader } = require("../util.js");

class PlayerParty {
    constructor(party) {
        this.world = party.server;
        this.self = new PlayerPartyMember(party.name, party.uuid, party.x, party.y, party.z, party.character, party.nickname ?? null, "SELF");
        this.party = ["party", "friends", "guild"]
            .flatMap(relationship => party[relationship]
                .map(v => new PlayerPartyMember(v.name, v.uuid, v.x, v.y, v.z, v.character, v.nickname ?? null, relationship.toUpperCase().replace(/S$/, "")))
            );
    };
}

module.exports = PlayerParty;
