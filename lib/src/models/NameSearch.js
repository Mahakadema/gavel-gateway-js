
const BaseAPIObject = require("./BaseAPIObject.js");
const { semVerFromHeader } = require("../util.js");
const Item = require("./Item.js");
const GuildListItem = require("./GuildListItem.js");
const { fetchPlayer } = require("../index.js");

const VERSION = "3.1.0";

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
        this.items = Object.getOwnPropertyNames(b.items ?? {}).filter(v => ["armour", "weapon", "accessory"].includes(b.items[v].type)).map(v => new Item(v, b.items[v]));
        // TODO: discoveries
        this.territories = Object.getOwnPropertyNames(b.territories ?? {}).map(v => ({
            name: v,
            location: {
                x: {
                    min: b.territories[v].start[0],
                    max: b.territories[v].end[0]
                },
                z: {
                    min: b.territories[v].start[1],
                    max: b.territories[v].end[1]
                }
            }
        }));
        this.discoveries = Object.getOwnPropertyNames(b.discoveries ?? {}).map(v => ({
            name: v,
            location: {
                x: {
                    min: b.discoveries[v].start[0],
                    max: b.discoveries[v].end[0]
                },
                y: {
                    min: b.discoveries[v].start[1],
                    max: b.discoveries[v].end[1]
                },
                z: {
                    min: b.discoveries[v].start[2],
                    max: b.discoveries[v].end[2]
                }
            }
        }));
    };
}

module.exports = NameSearch;
