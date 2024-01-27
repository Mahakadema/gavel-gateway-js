
const { fetchPlayer } = require("../index.js");

class PlayerPartyMember {
    constructor(name, uuid, x, y, z, character, nick, relationship) {
        this.name = name;
        this.nickname = nick;
        this.uuid = uuid;
        this.character = character;
        this.x = x;
        this.y = y;
        this.z = z;
        this.relationship = relationship;
    }

    fetch(options) {
        return fetchPlayer({ ...options, player: this.uuid });
    }
}

module.exports = PlayerPartyMember;
