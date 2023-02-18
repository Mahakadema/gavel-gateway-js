
const BaseAPIObject = require("./BaseAPIObject.js");
const PlayerClass = require("./PlayerClass.js");
const { fetchGuild } = require("../index.js");

const VERSION = "2.1.0";

class Player extends BaseAPIObject {
    constructor(json, params) {
        super(params.requestTimestamp, json.currentTimestamp, json.timestamp, json.version, VERSION, params.source);

        const a = json.data[0];

        this.name = a.username;
        this.uuid = a.uuid;
        this.rank = {
            serverRank: a.rank.toUpperCase(),
            donatorRank: a.meta.tag.value,
            displayDonatorRank: a.meta.tag.display,
            veteran: a.meta.veteran
        };
        this.firstJoin = new Date(a.meta.firstJoin);
        this.firstJoinTimestamp = Date.parse(a.meta.firstJoin);
        this.lastJoin = new Date(a.meta.lastJoin);
        this.lastJoinTimestamp = Date.parse(a.meta.lastJoin);
        this.playtime = a.meta.playtime;
        this.world = a.meta.location.server;
        this.guild = {
            name: a.guild.name,
            rank: a.guild.rank,
            fetch(options) {
                options ??= {};
                if (typeof options !== "object")
                    throw new TypeError("options have to be valid GuildRequestOptions");
                return fetchGuild({ ...options, guild: a.guild.name });
            }
        };
        this.totalLevel = {
            combat: a.global.totalLevel.combat,
            profession: a.global.totalLevel.profession,
            combined: a.global.totalLevel.combined
        };
        this.pvp = {
            kills: a.global.pvp.kills,
            deaths: a.global.pvp.deaths
        };
        this.classes = Object.getOwnPropertyNames(a.characters).map(v => new PlayerClass(v, a.characters[v]));
        this.blocksWalked = a.global.blocksWalked;
        this.itemsIdentified = a.global.itemsIdentified;
        this.mobsKilled = a.global.mobsKilled;
        this.logins = a.global.logins;
        this.deaths = a.global.deaths;
        this.discoveries = a.global.discoveries;
        this.eventsWon = a.global.eventsWon;
        this.ranking = {
            guild: a.ranking.guild,
            pvp: a.ranking.pvp,
            player: {
                combined: {
                    all: a.ranking.player.overall.all,
                    combat: a.ranking.player.overall.combat,
                    profession: a.ranking.player.overall.profession
                },
                solo: {
                    all: a.ranking.player.solo.overall,
                    combat: a.ranking.player.solo.combat,
                    profession: a.ranking.player.solo.profession,

                    mining: a.ranking.player.solo.mining,
                    fishing: a.ranking.player.solo.fishing,
                    farming: a.ranking.player.solo.farming,
                    woodcutting: a.ranking.player.solo.woodcutting,

                    armoring: a.ranking.player.solo.armouring,
                    tailoring: a.ranking.player.solo.tailoring,
                    jeweling: a.ranking.player.solo.jeweling,
                    woodworking: a.ranking.player.solo.woodworking,
                    weaponsmithing: a.ranking.player.solo.weaponsmithing,
                    scribing: a.ranking.player.solo.scribing,
                    alchemism: a.ranking.player.solo.alchemism,
                    cooking: a.ranking.player.solo.cooking
                }
            }
        };
    };
}

module.exports = Player;
