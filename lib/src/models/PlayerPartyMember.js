
const { fetchPlayer } = require("../index.js");

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

module.exports = PlayerPartyMember;
