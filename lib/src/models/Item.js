
const minecraftIds = require("../../data/minecraftIds.json");
const sprites = require("../../data/sprites.json");
const identifications = require("../../data/identifications.json");
const majorIds = require("../../data/majorIds.json");

/**
 * @typedef {"STRENGTH"|"DEXTERITY"|"INTELLIGENCE"|"DEFENCE"|"AGILITY"|"MAIN_ATTACK_DAMAGE_PERCENT"|"MAIN_ATTACK_DAMAGE_RAW"|"SPELL_DAMAGE_PERCENT"|"SPELL_DAMAGE_RAW"|"RAINBOW_SPELL_DAMAGE_RAW"|"EARTH_DAMAGE"|"THUNDER_DAMAGE"|"WATER_DAMAGE"|"FIRE_DAMAGE"|"AIR_DAMAGE"|"EARTH_DEFENCE"|"THUNDER_DEFENCE"|"WATER_DEFENCE"|"FIRE_DEFENCE"|"AIR_DEFENCE"|"HEALTH_REGEN_PERCENT"|"HEALTH_REGEN_RAW"|"HEALTH"|"LIFE_STEAL"|"MANA_REGEN"|"MANA_STEAL"|"SPELL_COST_PCT_1"|"SPELL_COST_RAW_1"|"SPELL_COST_PCT_2"|"SPELL_COST_RAW_2"|"SPELL_COST_PCT_3"|"SPELL_COST_RAW_3"|"SPELL_COST_PCT_4"|"SPELL_COST_RAW_4"|"ATTACK_SPEED"|"POISON"|"THORNS"|"REFLECTION"|"EXPLODING"|"JUMP_HEIGHT"|"WALK_SPEED"|"SPRINT_DURATION"|"SPRINT_REGEN"|"SOUL_POINT_REGEN"|"GATHERING_SPEED"|"GATHERING_XP_BONUS"|"XP_BONUS"|"LOOT_BONUS"|"LOOT_QUALITY"|"STEALING"} IdentificationName A name for an item identification
 * @typedef {"SAVIOURS_SACRIFICE"|"PEACEFUL_EFFIGY"|"FURIOUS_EFFIGY"|"PLAGUE"|"HAWKEYE"|"CHERRY_BOMBS"|"FLASHFREEZE"|"GREED"|"LIGHTWEIGHT"|"CAVALRYMAN"|"MAGNET"|"FISSION"|"RALLY"|"GUARDIAN"|"HEART_OF_THE_PACK"|"TRANSCENDENCE"|"ENTROPY"|"ROVING_ASSASSIN"|"GEOCENTRISM"|"FREERUNNER"|"MADNESS"|"SORCERY"|"EXPLOSIVE_IMPACT"|"TAUNT"} MajorId A name for an item major ID
 * @typedef {"BOOTS"|"LEGGINGS"|"CHESTPLATE"|"HELMET"|"SPEAR"|"WAND"|"BOW"|"DAGGER"|"RELIK"|"RING"|"BRACELET"|"NECKLACE"} ItemType All weapon, armor, and accessory types
 * @typedef {"SUPER_FAST"|"VERY_FAST"|"FAST"|"NORMAL"|"SLOW"|"VERY_SLOW"|"SUPER_SLOW"} AttackSpeed A weapon attack speed
 * @typedef {"MYTHIC"|"FABLED"|"LEGENDARY"|"RARE"|"SET"|"UNIQUE"|"NORMAL"} ItemRarity An item rarity tier
 * @typedef {"NEVER"|"NORMAL"|"DUNGEON"|"LOOTCHEST"} ItemDropType A source an item can be obtained from
 * @typedef {"ARMOR"|"WEAPON"|"ACCESSORY"} ItemCategory A category to search items or recipes by
 * @typedef {"UNTRADABLE"|"QUEST"} ItemRestriction A restriction put on an item
 */

/**
 * Requirements to use an item
 * @typedef {Object} ItemRequirements
 * @property {number} level The minimum combat level required to use the item
 * @property {string} [quest] The optional quest required to use the item
 * @property {import("./Player").ClassType} [class] The class required to use the item; always the non-donator class; is currently never set on weapons
 * @property {number} strength The strength requirement to use the item
 * @property {number} dexterity The dexterity requirement to use the item
 * @property {number} intelligence The intelligence requirement to use the item
 * @property {number} defence The defence requirement to use the item
 * @property {number} agility The agility requirement to use the item
 */

/**
 * Stats for items; weapon stats are only set on weapons; armor stats are
 * only set on armor
 * @typedef {Object} ItemStats
 * @property {number} powderSlots The powderslots of the item
 * @property {number} [health] The health of the armor piece
 * @property {number} [earthDefence] The earth defence of the armor piece or accessory
 * @property {number} [thunderDefence] The thunder defence of the armor piece or accessory
 * @property {number} [waterDefence] The water defence of the armor piece or accessory
 * @property {number} [fireDefence] The fire defence of the armor piece or accessory
 * @property {number} [airDefence] The air defence of the armor piece or accessory
 * @property {Range} [damage] The neutral damage of the weapon
 * @property {Range} [earthDamage] The earth damage of the weapon
 * @property {Range} [thunderDamage] The thunder damage of the weapon
 * @property {Range} [waterDamage] The water damage of the weapon
 * @property {Range} [fireDamage] The fire damage of the weapon
 * @property {Range} [airDamage] The air damage of the weapon
 * @property {AttackSpeed} [attackSpeed] The attack speed of the weapon
 */

/**
 * A singular identification
 * @typedef {Object} Identification
 * @property {IdentificationName} name The name of the identification
 * @property {number} [base] The base value for the identification; only present on items
 * @property {number} min The minimal value of the identification's roll
 * @property {number} max The maximum value of the identification's roll
 */

/**
 * An item skin as found in the mojang API; this data does not update
 * @typedef {Object} ItemSkin
 * @property {string} [uuid] The UUID of the player used for the skin; only present on some skins
 * @property {string} [name] The name of the player used for the skin; only present on some skins
 * @property {string} url The URL to the player skin
 */

/**
 * Represents an Item from the API
 * @class
 */
module.exports = class Item {
    constructor(v) {
        /**
         * The name of the item
         * @type {string}
         */
        this.name = v.name;
        /**
         * The name of the item, as displayed in-game
         * @type {string}
         */
        this.displayName = v.displayName ?? v.name;

        /**
         * The type of item
         * @type {ItemType}
         */
        this.type = (v.type ?? v.accessoryType).toUpperCase();
        /**
         * The category of the item
         * @type {ItemCategory}
         */
        this.category = v.category.toUpperCase();
        /**
         * The rarity of the item
         * @type {ItemRarity}
         */
        this.tier = v.tier.toUpperCase();
        /**
         * The set the item is part of, if any; currently, this value is only
         * used for the "LEAF" set
         * @type {?string}
         */
        this.set = v.set?.toUpperCase() ?? null;
        /**
         * Whether the item is pre-identified; i.e. items bought from merchants
         * @type {boolean}
         */
        this.identified = v.identified ?? false;

        // It is possible neither v.material nor v.armorType nor v.skin is given,
        // in that case the default skin for the item type is used
        const defaultSprite = sprites[this.category === "ARMOR" ? `${v.armorType.toUpperCase()}_${this.type}` : `${this.type}_DEFAULT_0`];
        /**
         * the visual sprite of the item; items using mob heads (not player
         * heads) will display as `minecraft:leather_helmet` and no ItemSkin
         * @type {import("../util").Sprite}
         */
        this.sprite = {
            id: defaultSprite.id,
            numericalId: defaultSprite.numericalId,
            damage: defaultSprite.damage
        };
        if (v.skin) { // skin has higher prioritization as material values
            this.sprite.id = "minecraft:skull";
            this.sprite.numericalId = 397;
            this.sprite.damage = 3;
        } else if (typeof v.material === "string") { // weapon material
            const parts = v.material.split(":");
            this.sprite.id = minecraftIds.strings[parts[0]];
            this.sprite.numericalId = Number(parts[0]);
            this.sprite.damage = Number(parts[1]) ?? 0;
        }
        // 160,101,64 is default color
        if (v.armorColor && v.armorColor !== "160,101,64" && v.armorColor !== 0) {
            const colors = v.armorColor.split(",");
            /**
             * The armor color of the item
             * @type {?number[]}
             */
            this.color = colors.map(v1 => Number(v1));
        }
        /**
         * The lore of the item
         * @type {string}
         */
        this.lore = v.addedLore ?? "";
        /**
         * The player head skin this item uses
         * @type {ItemSkin}
         */
        this.skin = null;
        if (v.skin) {
            const skin = JSON.parse(Buffer.from(v.skin, "base64").toString("ascii"));
            this.skin = {
                uuid: skin.profileId ?? null,
                name: skin.profileName ?? null,
                url: skin.textures.SKIN.url
            };
        }

        /**
         * How this item can be obtained
         * @type {ItemDropType}
         */
        this.dropType = v.dropType.toUpperCase();
        /**
         * The restriction put on the item
         * @type {ItemRestriction}
         */
        this.restriction = v.restrictions?.toUpperCase().replace(" ", "_") ?? null;
        /**
         * Whether Craftsman characters can use the item
         * @type {boolean}
         */
        this.craftsmanAllowed = v.allowCraftsman ?? false;
        /**
         * The requirements to use this item
         * @type {ItemRequirements}
         */
        this.requirements = {
            level: v.level,
            quest: v.quest,
            class: v.classRequirement?.toUpperCase() ?? null,
            strength: v.strength,
            dexterity: v.dexterity,
            intelligence: v.intelligence,
            defence: v.defense,
            agility: v.agility
        };

        const dmg = v.damage?.split("-");
        const edmg = v.earthDamage?.split("-");
        const tdmg = v.thunderDamage?.split("-");
        const wdmg = v.waterDamage?.split("-");
        const fdmg = v.fireDamage?.split("-");
        const admg = v.airDamage?.split("-");
        /**
         * The stats of this item
         * @type {ItemStats}
         */
        this.stats = {
            powderSlots: v.sockets,
            health: v.health ?? null,
            earthDefence: v.earthDefense ?? null,
            thunderDefence: v.thunderDefense ?? null,
            waterDefence: v.waterDefense ?? null,
            fireDefence: v.fireDefense ?? null,
            airDefence: v.airDefense ?? null,
            damage: dmg ? {
                min: Number(dmg[0]),
                max: Number(dmg[1])
            } : null,
            earthDamage: edmg ? {
                min: Number(edmg[0]),
                max: Number(edmg[1])
            } : null,
            thunderDamage: tdmg ? {
                min: Number(tdmg[0]),
                max: Number(tdmg[1])
            } : null,
            waterDamage: wdmg ? {
                min: Number(wdmg[0]),
                max: Number(wdmg[1])
            } : null,
            fireDamage: fdmg ? {
                min: Number(fdmg[0]),
                max: Number(fdmg[1])
            } : null,
            airDamage: admg ? {
                min: Number(admg[0]),
                max: Number(admg[1])
            } : null,
            attackSpeed: v.attackSpeed?.toUpperCase() ?? null
        };
        /**
         * The identifications of this item
         * @type {Identification[]}
         */
        this.identifications = [];
        for (const id of identifications) {
            if (v[id.itemApiName]) { // ID !== 0 (and also in case a new version of the API removes an ID)
                this.identifications.push({
                    name: id.name,
                    base: v[id.itemApiName],
                    min: id.static || this.identified ? v[id.itemApiName] : v[id.itemApiName] > 0 ? Math.max(1, Math.round(v[id.itemApiName] * 0.3)) : Math.round(v[id.itemApiName] * 1.3),
                    max: id.static || this.identified ? v[id.itemApiName] : v[id.itemApiName] > 0 ? Math.round(v[id.itemApiName] * 1.3) : Math.min(-1, Math.round(v[id.itemApiName] * 0.7)),
                });
            }
        }
        /**
         * A list of this items major IDs
         * @type {MajorId[]}
         */
        this.majorIds = [];
        if (v.majorIds) {
            this.majorIds = v.majorIds.map(v1 => majorIds.find(v2 => v2.apiName === v1)?.name ?? v1);
        }
    }
}
