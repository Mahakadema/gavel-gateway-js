
const { classBaseType, classType } = require("../util.js");

class PlayerClass {
    constructor(uuid, v) {
        this.uuid = uuid;
        this.baseType = classBaseType(v.type.toUpperCase());
        this.type = classType(v.type.toUpperCase());
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

module.exports = PlayerClass;
