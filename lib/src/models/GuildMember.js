
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
        return fetchPlayer({ ...options, player: this.uuid });
    }
}

module.exports = GuildMember;
