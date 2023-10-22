
const { fetchPlayer } = require("../index.js");

const findWorld = (name, onlinePlayers) => onlinePlayers.list.find(v => v.players.includes(name)) ?? null;

class GuildMember {
    constructor(identifier, data, rank, onlinePlayers, fetchAdditionalStats, usesUUIDs) {
        this.name = usesUUIDs ? data.username : identifier;
        this.uuid = usesUUIDs ? identifier : data.uuid;
        this.rank = rank.toUpperCase();
        this.joined = new Date(data.joined.concat("Z"));
        this.joinedTimestamp = Date.parse(data.joined.concat("Z"));
        this.xp = data.contributed;
        // TODO: docs
        this.world = fetchAdditionalStats ? findWorld(this.name, onlinePlayers) : data.server;
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

module.exports = GuildMember;
