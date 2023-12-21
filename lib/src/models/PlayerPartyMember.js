
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
        options ??= {};
        if (typeof options !== "object")
            return Promise.reject(new TypeError("options have to be valid PlayerRequestOptions"));
        const copiedOptions = { ...options };
        copiedOptions.player = this.uuid;
        return fetchPlayer(copiedOptions);
    }
}

module.exports = PlayerPartyMember;
