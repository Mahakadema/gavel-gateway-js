
const BaseAPIObject = require("./BaseAPIObject.js");
const { semVerFromHeader } = require("../util.js");
const Item = require("./Item.js");
const GuildListItem = require("./GuildListItem.js");
const { fetchPlayer } = require("../index.js");

const VERSION = "3.0.0";

class NameSearch extends BaseAPIObject {
    constructor(rawResult, params) {
        super(rawResult.requestedAt, rawResult.respondedAt, rawResult.receivedAt, rawResult.dataTimestamp, semVerFromHeader(rawResult.headers["version"]), VERSION, params.source);

        const b = rawResult.body === "No result found." ? { query: params.query } : rawResult.body;

        this.query = b.query;
        this.guilds = Object.getOwnPropertyNames(b.guilds ?? {}).map(uuid => new GuildListItem(uuid, b.guilds[uuid].name, b.guilds[uuid].prefix));
        this.guildTags = Object.getOwnPropertyNames(b.guildsPrefix ?? {}).map(uuid => new GuildListItem(uuid, b.guildsPrefix[uuid].name, b.guildsPrefix[uuid].prefix));
        this.players = Object.getOwnPropertyNames(b.players ?? {}).map(uuid => ({
            uuid,
            name: b.players[uuid],
            fetch: (options) => fetchPlayer({ ...options, player: uuid })
        }));
        this.items = Object.getOwnPropertyNames(b.items ?? {}).filter(v => b.items[v].type || b.items[v].accessoryType).map(v => new Item(v, b.items[v]));
    };
}

module.exports = NameSearch;
