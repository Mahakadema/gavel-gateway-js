
const { fetchPlayer } = require("../index.js");

class GuildMember {
    constructor(uuid, data, rank) {
        this.name = data.username;
        this.uuid = uuid;
        this.rank = rank.toUpperCase();
        this.joined = new Date(data.joined);
        this.joinedTimestamp = Date.parse(data.joined);
        this.xp = data.contributed;
        this.world = data.server;
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

module.exports = GuildMember;
