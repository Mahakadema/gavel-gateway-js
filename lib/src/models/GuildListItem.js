
const { fetchGuild } = require("../index.js");

class GuildListItem {
    constructor(v) {
        this.name = v.name;
        this.tag = v.prefix;
    }

    fetch(options) {
        options ??= {};
        if (typeof options !== "object")
            return Promise.reject(new Error("options have to be valid GuildRequestOptions"));
        const copiedOptions = { ...options };
        copiedOptions.name = this.name;
        return fetchGuild(copiedOptions);
    }
}

module.exports = GuildListItem;
