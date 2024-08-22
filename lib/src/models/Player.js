
const BaseAPIObject = require("./BaseAPIObject.js");
const PlayerClass = require("./PlayerClass.js");
const { fetchGuild } = require("../index.js");
const { semVerFromHeader, CDN_URL } = require("../util.js");

const VERSION = "3.1.0";

class Player extends BaseAPIObject {
    constructor(rawResult, params) {
        super(rawResult.requestedAt, rawResult.respondedAt, rawResult.receivedAt, rawResult.dataTimestamp, semVerFromHeader(rawResult.headers["version"]), VERSION, params.source);

        const b = rawResult.body;
        const classes = Object.getOwnPropertyNames(b.characters ?? {}).map(v => new PlayerClass(v, b.characters[v], b.publicProfile, b.uuid));
        const guildUUID = b.guild?.uuid ?? null;

        this.name = b.username;
        this.uuid = b.uuid;
        this.publicProfile = b.publicProfile;
        this.lastCharacter = classes.find(v => b.activeCharacter && v.uuid === b.activeCharacter) ?? null;
        this.rank = {
            serverRank: b.rank.toUpperCase(), // TODO: possibly rank is sometimes undefined
            shortenedServerRank: b.shortenedRank ?? b.rank,
            donatorRank: b.supportRank?.toUpperCase().replace("VIPPLUS", "VIP+") ?? null,
            veteran: b.veteran ?? false,
            textColor: b.legacyRankColour ? b.legacyRankColour.main : null,
            backgroundColor: b.legacyRankColour ? b.legacyRankColour.sub : null,
            badgeUrl: b.rankBadge ? CDN_URL + "/" + b.rankBadge : null
        };
        this.firstJoin = new Date(b.firstJoin);
        this.firstJoinTimestamp = Date.parse(b.firstJoin);
        this.lastJoin = new Date(b.lastJoin);
        this.lastJoinTimestamp = Date.parse(b.lastJoin);
        this.minutesPlayed = Math.round(b.playtime * 60)
        this.playtime = Math.round(b.playtime * 12);
        this.world = b.server;
        this.guild = {
            uuid: b.guild?.uuid ?? null,
            name: b.guild?.name ?? null,
            tag: b.guild?.prefix ?? null,
            rank: b.guild?.rank ?? null,
            fetch(options) {
                return fetchGuild({ ...options, uuid: guildUUID });
            }
        };
        const combinedTotalLevel = classes.map(v => v.totalLevel).reduce((p, c) => p + c, 0);
        const combatTotalLevel = classes.map(v => v.levels.combat.level).reduce((p, c) => p + c, 0);
        this.totalLevel = {
            combat: combatTotalLevel,
            profession: combinedTotalLevel - combatTotalLevel,
            combined: combinedTotalLevel,
            includingDeleted: b.globalData.totalLevel
        };
        this.pvp = {
            kills: b.globalData.pvp.kills,
            deaths: b.globalData.pvp.deaths
        };
        const dungeonsDeleted = Object.getOwnPropertyNames(b.globalData.dungeons.list).map(v => ({
            name: v,
            completed: b.globalData.dungeons.list[v]
        }));
        this.dungeons = dungeonsDeleted.map(content => ({
            name: content.name,
            completed: classes.map(v => v.dungeons.find(v => v.name === content.name)?.completed ?? 0).reduce((p, c) => p + c, 0)
        })).filter(v => v.completed);
        this.dungeonsIncludingDeleted = dungeonsDeleted;
        const raidsDeleted = Object.getOwnPropertyNames(b.globalData.raids.list).map(v => ({
            name: v,
            completed: b.globalData.raids.list[v]
        }));
        this.raids = raidsDeleted.map(content => ({
            name: content.name,
            completed: classes.map(v => v.raids.find(v => v.name === content.name)?.completed ?? 0).reduce((p, c) => p + c, 0)
        })).filter(v => v.completed);
        this.raidsIncludingDeleted = raidsDeleted;
        this.wars = b.globalData.wars;
        this.quests = b.globalData.completedQuests;
        this.chestsOpened = b.globalData.chestsFound;
        this.blocksWalked = classes.map(v => v.blocksWalked).reduce((p, c) => p + c, 0) | 0;
        this.itemsIdentified = classes.map(v => v.itemsIdentified).reduce((p, c) => p + c, 0);
        this.mobsKilled = b.globalData.killedMobs;
        this.logins = classes.map(v => v.logins).reduce((p, c) => p + c, 0);
        this.deaths = classes.map(v => v.deaths).reduce((p, c) => p + c, 0);
        this.discoveries = classes.map(v => v.discoveries).reduce((p, c) => p + c, 0);
        this.classes = classes;
        this.ranking = Object.fromEntries(Object.getOwnPropertyNames(b.ranking).map(v => [v, b.ranking[v]]));
        this.ranking = Object.fromEntries(Object.getOwnPropertyNames(b.previousRanking).map(v => [v, b.previousRanking[v]]));
        this.forumId = b.forumLink ?? null;
    };
}

module.exports = Player;
