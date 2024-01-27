
const { fetchGuild } = require("../index.js");
const { UUID_PATTERN } = require("../util.js");

class GuildListItem {
    constructor(uuid, name, tag) {
        if (uuid !== undefined) {
            this.uuid = uuid;
            if (!UUID_PATTERN.test(uuid))
                throw new Error("Guild UUID must be a UUID");
        }
        this.name = name;
        if (typeof name !== "string")
            throw new Error("Guild name must be a string");
        this.tag = tag;
    }

    fetch(options) {
        return fetchGuild({ ...options, guild: this.name });
    }
}

module.exports = GuildListItem;
