
const BaseAPIObject = require("./BaseAPIObject.js");
const { semVerFromDecimal, semVerFromHeader } = require("../util.js");
const Item = require("./Item.js");
const GuildListItem = require("./GuildListItem.js");

const VERSION = "2.0.0";

class NameSearch extends BaseAPIObject {
    constructor(rawResult, params) {
        super(rawResult.requestedAt, rawResult.respondedAt, rawResult.receivedAt, rawResult.dataTimestamp, semVerFromHeader(rawResult.headers["version"]), VERSION, params.source);

        const b = rawResult.body === "No result found." ? { query: params.query } : rawResult.body;

        this.query = b.query;
        this.guilds = b.guilds?.slice() ?? [];
        this.guildTags = Object.getOwnPropertyNames(b.guildsPrefix ?? {}).map(tag => new GuildListItem({ prefix: tag, name: b.guildsPrefix[tag] }));
        this.players = Object.getOwnPropertyNames(b.players ?? {}).map(name => ({
            uuid: b.players[name],
            name: name
        }));
        this.items = Object.getOwnPropertyNames(b.items ?? {}).map(v => new Item(v, b.items[v]));
    };
}

module.exports = NameSearch;
