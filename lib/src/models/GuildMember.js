
const { fetchPlayer } = require("../index.js");

const findWorld = (name, onlinePlayers) => onlinePlayers.list.find(v => v.players.includes(name)) ?? null;

class GuildMember {
    constructor(data, onlinePlayers, fetchAdditionalStats) {
        this.name = data.name;
        this.uuid = data.uuid;
        this.rank = data.rank;
        this.joined = new Date(data.joined);
        this.joinedTimestamp = Date.parse(data.joined);
        this.xp = data.contributed;
        if (fetchAdditionalStats)
            this.world = findWorld(this.name, onlinePlayers);
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
