
const BaseAPIObject = require("./BaseAPIObject.js");
const { classTypeLegacy, classType, classSkin } = require("../util.js");
const { fetchGuild } = require("../index.js");

const VERSION_LEGACY = "1.0.0";
const VERSION = "2.0.0";

class PlayerClass {
    constructor(uuid, v) {
        if (uuid) {
            this.uuid = v.uuid;
            this.type = classType(v.type);
            this.skin = classSkin(v.type);
        } else {
            this.name = v.name;
            this.type = classTypeLegacy(v.name);
        }
        this.totalLevel = v.level + 12;
        this.levels = {
            combat: {
                level: v.professions.combat.level,
                xp: Math.round(v.professions.combat.xp * 10) / 1000
            },
            mining: {
                level: v.professions.mining.level,
                xp: Math.round(v.professions.mining.xp * 10) / 1000
            },
            farming: {
                level: v.professions.farming.level,
                xp: Math.round(v.professions.farming.xp * 10) / 1000
            },
            fishing: {
                level: v.professions.fishing.level,
                xp: Math.round(v.professions.fishing.xp * 10) / 1000
            },
            woodcutting: {
                level: v.professions.woodcutting.level,
                xp: Math.round(v.professions.woodcutting.xp * 10) / 1000
            },
            armoring: {
                level: v.professions.armouring.level,
                xp: Math.round(v.professions.armouring.xp * 10) / 1000
            },
            tailoring: {
                level: v.professions.tailoring.level,
                xp: Math.round(v.professions.tailoring.xp * 10) / 1000
            },
            jeweling: {
                level: v.professions.jeweling.level,
                xp: Math.round(v.professions.jeweling.xp * 10) / 1000
            },
            woodworking: {
                level: v.professions.woodworking.level,
                xp: Math.round(v.professions.woodworking.xp * 10) / 1000
            },
            weaponsmithing: {
                level: v.professions.weaponsmithing.level,
                xp: Math.round(v.professions.weaponsmithing.xp * 10) / 1000
            },
            scribing: {
                level: v.professions.scribing.level,
                xp: Math.round(v.professions.scribing.xp * 10) / 1000
            },
            alchemism: {
                level: v.professions.alchemism.level,
                xp: Math.round(v.professions.alchemism.xp * 10) / 1000
            },
            cooking: {
                level: v.professions.cooking.level,
                xp: Math.round(v.professions.cooking.xp * 10) / 1000
            },
        };
        this.quests = v.quests.list.slice();
        this.dungeons = v.dungeons.list.slice();
        this.raids = v.raids.list.slice();
        this.skillPoints = {
            strength: v.skills.strength,
            dexterity: v.skills.dexterity,
            intelligence: v.skills.intelligence,
            defence: v.skills.defence,
            agility: v.skills.agility
        };
        this.gamemodes = {
            hardcore: v.gamemode.hardcore,
            ironman: v.gamemode.ironman,
            craftsman: v.gamemode.craftsman,
            hunted: v.gamemode.hunted,
        };
        this.pvp = {
            kills: v.pvp.kills,
            deaths: v.pvp.deaths
        };
        this.playtime = v.playtime;
        this.itemsIdentified = v.itemsIdentified;
        this.mobsKilled = v.mobsKilled;
        this.logins = v.logins;
        this.deaths = v.deaths;
        this.blocksWalked = v.blocksWalked;
        this.discoveries = v.discoveries;
        this.eventsWon = v.eventsWon;
        this.hasEconomyStar = v.preEconomyUpdate;
    };
}

class Player extends BaseAPIObject {
    constructor(json, params) {
        super(params.requestTimestamp, json.timestamp + params.timeDisparity, json.version, json.data[0].characters ? VERSION : VERSION_LEGACY, params.source);

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
            fetch() {
                if (a.guild.name)
                    return fetchGuild({ guild: a.guild.name });
                return new Promise(resolve => resolve(null));
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
        this.classes = a.characters ? Object.getOwnPropertyNames(a.characters).map(v => new PlayerClass(v, a.characters[v])) : a.classes.map(v => new PlayerClass(null, v));
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
