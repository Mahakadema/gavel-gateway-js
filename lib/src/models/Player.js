
const BaseAPIObject = require("./BaseAPIObject.js");
const { classType, semVerFromDecimal } = require("../util.js");
const { fetchGuild } = require("../index.js");

const VERSION = "1.0.0";

/**
 * @typedef {"ARCHER"|"ASSASSIN"|"DARK_WIZARD"|"HUNTER"|"KNIGHT"|"MAGE"|"NINJA"|"SHAMAN"|"SKYSEER"|"WARRIOR"} ClassType A type of player class
 * @typedef {"ADMINISTRATOR"|"MODERATOR"|"MEDIA"|"BUILDER"|"ITEM"|"GAME_MASTER"|"CMD"|"MUSIC"|"HYBRID"|"MEDIA"|"PLAYER"} ServerRank A staff rank on Wynncraft
 * @typedef {"CHAMPION"|"HERO"|"VIP+"|"VIP"} DonatorRank A donator rank on Wynncraft
 */

/**
 * Contains the information of one level
 * @typedef {Object} ClassLevelData
 * @property {number} level The whole level
 * @property {number} xp The XP percentage, expressed as a number between 0 and 1
 */

/**
 * Holds ClassLevelData for all levels on a class
 * @typedef {Object} ClassLevelsData
 * @property {ClassLevelData} combat The combat level of the class
 * @property {ClassLevelData} mining The mining level of the class
 * @property {ClassLevelData} farming The farming level of the class
 * @property {ClassLevelData} fishing The fishing level of the class
 * @property {ClassLevelData} woodcutting The woodcutting level of the class
 * @property {ClassLevelData} armoring The armoring level of the class
 * @property {ClassLevelData} tailoring The tailoring level of the class
 * @property {ClassLevelData} jeweling The jeweling level of the class
 * @property {ClassLevelData} weaponsmithing The weaponsmithing level of the class
 * @property {ClassLevelData} woodworking The woodworking level of the class
 * @property {ClassLevelData} alchemism The alchemism level of the class
 * @property {ClassLevelData} cooking The cooking level of the class
 * @property {ClassLevelData} scribing The scribing level of the class
 */

/**
 * Holds information on player or class PvP stats
 * @typedef {Object} PvpData
 * @property {number} kills The kills the player scored
 * @property {number} deaths The deaths the player suffered
 */

/**
 * Represents a piece of repeatable content, such as dungeons or raids,
 * completed by a player or class
 * @typedef {Object} RepeatableContent
 * @property {string} name The name of content
 * @property {number} completed The amount the player or class completed the content
 */

/**
 * An object containing information on manually assigned class skill points
 * @typedef {Object} SkillPoints
 * @property {number} strength The Strength skill of the class
 * @property {number} dexterity The Dexterity skill of the class
 * @property {number} intelligence The Intelligence skill of the class
 * @property {number} defence The Defence skill of the class
 * @property {number} agility The Agility skill of the class
 */

/**
 * Holds information of class gamemodes
 * @typedef {Object} Gamemodes
 * @property {boolean} hardcore Whether the class is in Hardcore mode
 * @property {boolean} ironman Whether the class is in Ironman mode
 * @property {boolean} craftsman Whether the class is in Craftsman mode
 * @property {boolean} hunted Whether the class is in the Hunted gamemode; does not reflect the player turning Hunted mode on
 */

/**
 * Holds information about a players Guild
 * @typedef {Object} PlayerGuildData
 * @property {string} name The name of the players Guild
 * @property {import("./Guild").GuildRank} rank The players rank in the Guild
 * @property {function(import("../index").GuildRequestOptions):Promise<import("./Guild")} fetch Returns the API object of the Guild
 */

/**
 * Holds information about player ranks
 * @typedef {Object} RankData
 * @property {ServerRank} serverRank The players' server rank
 * @property {DonatorRank} donatorRank The players' donator rank
 * @property {boolean} displayDonatorRank Whether to display the players donator rank
 * @property {boolean} veteran Whether the player is a veteran (bought a rank before first Minecraft EULA change)
 */

/**
 * Holds total level data
 * @typedef {Object} PlayerLevelsData
 * @property {number} combat The combined combat level of the player
 * @property {number} profession The combined profession level of the player
 * @property {number} combined The combined total level of the player
 */

/**
 * A players' combined level rankings
 * @typedef {Object} PlayerPersonalCombinedRankings
 * @property {number} [all] Position in the leaderboard of combined total level, counting combat and profession across all classes
 * @property {number} [combat] Position in the leaderboard of combat level, counting combat across all classes
 * @property {number} [profession] Position in the leaderboard of profession level, counting profession across all classes
 */

/**
 * A players' single class level rankings
 * @typedef {Object} PlayerPersonalSoloRankings
 * @property {number} [all] Position in the leaderboard of total level, counting the total level of their highest levelled class
 * @property {number} [combat] Position in the leaderboard of combat level, counting the combat level of their highest levelled combat class
 * @property {number} [profession] Position in the leaderboard of profession level, counting the profession level of their highest levelled profession class
 * @property {number} [mining] Position in the leaderboard of mining level, counting the mining level of their highest levelled mining class
 * @property {number} [farming] Position in the leaderboard of farming level, counting the farming level of their highest levelled farming class
 * @property {number} [fishing] Position in the leaderboard of fishing level, counting the fishing level of their highest levelled fishing class
 * @property {number} [woodcutting] Position in the leaderboard of woodcutting level, counting the woodcutting level of their highest levelled woodcutting class
 * @property {number} [armoring] Position in the leaderboard of armoring level, counting the armoring level of their highest levelled armoring class
 * @property {number} [tailoring] Position in the leaderboard of tailoring level, counting the tailoring level of their highest levelled tailoring class
 * @property {number} [jeweling] Position in the leaderboard of jeweling level, counting the jeweling level of their highest levelled jeweling class
 * @property {number} [woodworking] Position in the leaderboard of woodworking level, counting the woodworking level of their highest levelled woodworking class
 * @property {number} [weaponsmithing] Position in the leaderboard of weaponsmithing level, counting the weaponsmithing level of their highest levelled weaponsmithing class
 * @property {number} [alchemism] Position in the leaderboard of alchemism level, counting the alchemism level of their highest levelled alchemism class
 * @property {number} [cooking] Position in the leaderboard of cooking level, counting the cooking level of their highest levelled cooking class
 * @property {number} [scribing] Position in the leaderboard of scribing level, counting the scribing level of their highest levelled scribing class
 */

/**
 * A players' level rankings
 * @typedef {Object} PlayerPersonalRankings
 * @property {PlayerPersonalCombinedRankings} combined The level rankings for combined levels
 * @property {PlayerPersonalSoloRankings} solo The level rankings for single class levels
 */

/**
 * Holds information on the player's leaderboard rankings
 * @typedef {Object} PlayerRankings
 * @property {number} [guild] The guild ranking of the player; currently unused
 * @property {number} [pvp] The PvP ranking of the player; currently unused
 * @property {PlayerPersonalRankings} player The level rankings of the player
 */

/**
 * Represents a class of a player
 * @class
 */
class PlayerClass {
    constructor(v) {
        /**
        * The name of the class
        * @type {string}
        */
        this.name = v.name;
        /**
        * The type of class
        * @type {ClassType}
        */
        this.type = classType(v.name);
        /**
        * The combined level of the class; contrary to the API, this includes
        * level 1 of professions
        * @type {number}
        */
        this.totalLevel = v.level + 12;
        /**
        * The profession and combat levels of the class
        * @type {ClassLevelsData}
        */
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
        /**
        * A list of all Quests completed on this class
        * @type {string[]}
        */
        this.quests = v.quests.list.slice();
        /**
        * A list of all dungeons completed on this class; ordered in ascending
        * order of first completion
        * @type {RepeatableContent[]}
        */
        this.dungeons = v.dungeons.list.slice();
        /**
        * A list of all raids completed on this class; ordered in ascending
        * order of first completion
        * @type {RepeatableContent[]}
        */
        this.raids = v.raids.list.slice();
        /**
        * The manually assigned skillpoints of the class
        * @type {SkillPoints}
        */
        this.skillPoints = {
            strength: v.skills.strength,
            dexterity: v.skills.dexterity,
            intelligence: v.skills.intelligence,
            defence: v.skills.defence,
            agility: v.skills.agility
        };
        /**
        * The gamemodes of the class
        * @type {Gamemodes}
        */
        this.gamemodes = {
            hardcore: v.gamemode.hardcore,
            ironman: v.gamemode.ironman,
            craftsman: v.gamemode.craftsman,
            hunted: v.gamemode.hunted,
        };
        /**
        * The PvP stats of the class
        * @type {PvpData}
        */
        this.pvp = {
            kills: v.pvp.kills,
            deaths: v.pvp.deaths
        };
        /**
        * The playtime on this class
        * @type {number}
        */
        this.playtime = v.playtime;
        /**
        * The amount of items identified on this class, this statistic is
        * currently not being updated
        * @type {number}
        */
        this.itemsIdentified = v.itemsIdentified;
        /**
        * The amount of mob kills on this class
        * @type {number}
        */
        this.mobsKilled = v.mobsKilled;
        /**
        * The amount of chests opened on this class
        * @type {number}
        */
        this.chestsOpened = v.chestsFound;
        /**
        * The amount of logins on this class
        * @type {number}
        */
        this.logins = v.logins;
        /**
        * The amount of deaths on this class
        * @type {number}
        */
        this.deaths = v.deaths;
        /**
        * The amount of blocks travelled by this class; also counts
        * teleportation; overflows like a 32-bit Integer
        * @type {number}
        */
        this.blocksWalked = v.blocksWalked;
        /**
        * The total amount of discoveries on this class; includes duplicate;
        * includes removed discoveries
        * @type {number}
        */
        this.discoveries = v.discoveries;
        /**
        * The amount of swarms won on this class
        * @type {number}
        */
        this.eventsWon = v.eventsWon;
        /**
        * Whether this class has reached combat level 101 before the Economy
        * Update 1.18 released; classes with this flag display a star next to
        * their level in chat
        * @type {boolean}
        */
        this.hasEconomyStar = v.preEconomyUpdate;
    };
}

/**
 * Represents a player from the API
 * @class
 */
module.exports = class Player extends BaseAPIObject {
    constructor(json, params) {
        super(params.requestTimestamp, json.timestamp, json.version, VERSION, params.source);

        const a = json.data[0];

        /**
         * The account name of the player
         * @type {string}
         */
        this.name = a.username;
        /**
         * The UUID of the player
         * @type {string}
         */
        this.uuid = a.uuid;
        /**
         * The rank data of the player
         * @type {RankData}
         */
        this.rank = {
            serverRank: a.rank.toUpperCase(),
            donatorRank: a.meta.tag.value,
            displayDonatorRank: a.meta.tag.display,
            veteran: a.meta.veteran
        };
        /**
         * The first join of the player as a Date
         * @type {Date}
         */
        this.firstJoin = new Date(a.meta.firstJoin);
        /**
         * The first join of the player as a unix timestamp
         * @type {number}
         */
        this.firstJoinTimestamp = Date.parse(a.meta.firstJoin);
        /**
         * The last join date of the player
         * @type {Date}
         */
        this.lastJoin = new Date(a.meta.lastJoin);
        /**
         * The last join date of the player as a unix timestamp
         * @type {number}
         */
        this.lastJoinTimestamp = Date.parse(a.meta.lastJoin);
        /**
         * The playtime of the player; this value is roughly equal to one fifth
         * of the players playtime in hours
         * @type {number}
         */
        this.playtime = a.meta.playtime;
        /**
         * The current world of the player, null if offline
         * @type {string}
         */
        this.world = a.meta.location.server;
        /**
         * The guild data of the player
         * @type {PlayerGuildData}
         */
        this.guild = {
            name: a.guild.name,
            rank: a.guild.rank,
            fetch() {
                return fetchGuild({ guild: a.guild.name })
            }
        };
        /**
         * The total levels of the player
         * @type {PlayerLevelsData}
         */
        this.totalLevel = {
            combat: a.global.totalLevel.combat,
            profession: a.global.totalLevel.profession,
            combined: a.global.totalLevel.combined
        };
        /**
         * The PvP stats of the player
         * @type {PvpData}
         */
        this.pvp = {
            kills: a.global.pvp.kills,
            deaths: a.global.pvp.deaths
        };
        /**
         * The classes of the player
         * @type {PlayerClass[]}
         */
        this.classes = a.classes.map(v => new PlayerClass(v));
        /**
         * The total chest count of the player
         * @type {number}
         */
        this.chestsOpened = a.global.chestsFound;
        /**
         * The total amount of blocks travelled by the player, also counts
         * teleportation, overflows like a 32-bit Integer
         * @type {number}
         */
        this.blocksWalked = a.global.blocksWalked;
        /**
         * The total amount of items identified; this statistic is currently
         * not being updated
         * @type {number}
         */
        this.itemsIdentified = a.global.itemsIdentified;
        /**
         * The total amount of mob kills
         * @type {number}
         */
        this.mobsKilled = a.global.mobsKilled;
        /**
         * The total amount of logins
         * @type {number}
         */
        this.logins = a.global.logins;
        /**
         * The total amount of deaths
         * @type {number}
         */
        this.deaths = a.global.deaths;
        /**
         * The total amount of discoveries; includes duplicates; includes
         * removed discoveries
         * @type {number}
         */
        this.discoveries = a.global.discoveries;
        /**
         * The total amount of swarms won
         * @type {number}
         */
        this.eventsWon = a.global.eventsWon;
        /**
         * The leaderboard rankings of the player in all levels; null if not in
         * top #100; rankings do not display any values if the player name is
         * mispelled in the request
         * @type {PlayerRankings}
         */
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
