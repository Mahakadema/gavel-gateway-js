
const { semVerFromHeader } = require("../util.js");
const { fetchLeaderboard } = require("../index.js");
const BaseAPIObject = require("./BaseAPIObject.js");

const VERSION = "2.0.0";

class LeaderboardTypes extends BaseAPIObject {
    constructor(rawResult, params) {
        super(rawResult.requestedAt, rawResult.respondedAt, rawResult.receivedAt, rawResult.dataTimestamp, semVerFromHeader(rawResult.headers["version"]), VERSION, params.source);

        this.guildLeaderboards = rawResult.body.filter(v => v.startsWith("guild")).map(name => ({
            name,
            fetch: (options) => fetchLeaderboard({ ...options, leaderboard: name })
        }));
        this.playerLeaderboards = rawResult.body.filter(v => !v.startsWith("guild")).map(name => ({
            name,
            fetch: (options) => fetchLeaderboard({ ...options, leaderboard: name })
        }));
    };
}

module.exports = LeaderboardTypes;
