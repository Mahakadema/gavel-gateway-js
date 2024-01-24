
const BaseAPIObject = require("./BaseAPIObject.js");
const { semVerFromHeader } = require("../util.js");
const Item = require("./Item.js");
const GuildListItem = require("./GuildListItem.js");

const VERSION = "3.0.1";
const OLD_VERSION = "3.0.0";

let used_VERSION = OLD_VERSION;

class NameSearch extends BaseAPIObject {
    constructor(rawResult, params) {
        super(rawResult.requestedAt, rawResult.respondedAt, rawResult.receivedAt, rawResult.dataTimestamp, semVerFromHeader(rawResult.headers["version"]), updateVersion(rawResult.body), params.source);

        const b = rawResult.body === "No result found." ? { query: params.query } : rawResult.body;

        this.query = b.query;
        this.guilds = b.guilds ? used_VERSION === OLD_VERSION ? b.guilds.map(v => new GuildListItem(undefined, v, undefined)) : Object.getOwnPropertyNames(b.guilds).map(uuid => new GuildListItem(uuid, b.guilds[uuid].name, b.guilds[uuid].prefix)) : [];
        this.guildTags = Object.getOwnPropertyNames(b.guildsPrefix ?? {}).map(identifier => used_VERSION === OLD_VERSION ? new GuildListItem(undefined, b.guildsPrefix[identifier], identifier) : new GuildListItem(identifier, b.guildsPrefix[identifier].name, b.guildsPrefix[identifier].prefix));
        this.players = Object.getOwnPropertyNames(b.players ?? {}).map(identifier => identifier.length !== 36 ? ({
            uuid: b.players[identifier],
            name: identifier
        }) : ({
            uuid: identifier,
            name: b.players[identifier]
        }));
        this.items = Object.getOwnPropertyNames(b.items ?? {}).map(v => new Item(v, b.items[v]));
    };
}

module.exports = NameSearch;

function updateVersion(body) {
    if (used_VERSION === VERSION)
        return VERSION;

    const prefixIdentifiers = Object.getOwnPropertyNames(body.guildsPrefix ?? {});
    const playerIdentifiers = Object.getOwnPropertyNames(body.players ?? {});
    if (prefixIdentifiers.some(v => v.length > 4)) {
        used_VERSION = VERSION;
    } else if (!Array.isArray(body.guilds ?? [])) {
        used_VERSION = VERSION;
    } else if (playerIdentifiers.some(v => v.length === 36)) {
        used_VERSION = VERSION;
    }

    return used_VERSION;
}
