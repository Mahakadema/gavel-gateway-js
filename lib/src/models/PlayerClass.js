
const { fetchPlayerCharacterAbilityTree } = require("../index.js");
const { classBaseType, classType, removeTheBritish } = require("../util.js");

class PlayerClass {
    constructor(uuid, v, publicProfile, playerUUID) {
        this.uuid = uuid;
        this.nickname = v.nickname ?? null;
        this.baseType = classBaseType(v.type.toUpperCase());
        this.type = classType(v.type.toUpperCase());
        this.totalLevel = v.totalLevel + 12;
        this.levels = {
            combat: {
                level: v.level,
                xp: Math.round(v.xpPercent * 10) / 1000,
                xpRaw: v.xp
            }
        };
        for (const prop of ["mining", "farming", "fishing", "woodcutting", "armouring", "tailoring", "jeweling", "woodworking", "weaponsmithing", "scribing", "alchemism", "cooking"]) {
            this.levels[removeTheBritish(prop.toUpperCase()).toLowerCase()] = {
                level: v.professions[prop].level,
                xp: Math.round(v.professions[prop].xpPercent * 10) / 1000
            }
        }
        this.quests = v.quests.slice();
        // TODO: check ordering
        this.dungeons = Object.getOwnPropertyNames(v.dungeons?.list ?? {}).map(contentName => ({
            name: contentName,
            completed: v.dungeons.list[contentName]
        }));
        this.raids = Object.getOwnPropertyNames(v.raids?.list ?? {}).map(contentName => ({
            name: contentName,
            completed: v.raids.list[contentName]
        }));
        this.skillPoints = publicProfile ? {
            strength: v.skillPoints.strength ?? 0,
            dexterity: v.skillPoints.dexterity ?? 0,
            intelligence: v.skillPoints.intelligence ?? 0,
            defence: v.skillPoints.defense ?? 0,
            agility: v.skillPoints.agility ?? 0
        } : null;
        this.gamemodes = {
            hardcore: v.gamemode.includes("hardcore"),
            ironman: v.gamemode.includes("ironman"),
            ultimateIronman: v.gamemode.includes("ultimate_ironman"),
            craftsman: v.gamemode.includes("craftsman"),
            hunted: v.gamemode.includes("hunted"),
        };
        this.pvp = {
            kills: v.pvp.kills,
            deaths: v.pvp.deaths
        };
        this.wars = v.wars;
        this.minutesPlayed = Math.round(v.playtime * 60);
        this.playtime = Math.round(v.playtime * 12);
        this.chestsOpened = v.chestsFound;
        this.itemsIdentified = v.itemsIdentified;
        this.mobsKilled = v.mobsKilled;
        this.logins = v.logins;
        this.deaths = v.deaths;
        this.blocksWalked = v.blocksWalked;
        this.discoveries = v.discoveries;
        this.hasEconomyStar = v.preEconomy;

        this._player = playerUUID;
    };

    fetchAbilityTree(options = {}) {
        return fetchPlayerCharacterAbilityTree({ ...options, player: this._player, character: this.uuid, class: this.type });
    }
}

module.exports = PlayerClass;
