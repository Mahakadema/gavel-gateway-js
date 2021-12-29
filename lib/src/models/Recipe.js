
const { removeTheBritish } = require("../util");

/**
 * @typedef {"ARMORING"|"ALCHEMISM"|"COOKING"|"JEWELING"|"SCRIBING"|"TAILORING"|"WEAPONSMITHING"|"WOODWORKING"} CraftingSkill A crafting profession skill
 * @typedef {"BOOTS"|"BOW"|"BRACELET"|"CHESTPLATE"|"DAGGER"|"FOOD"|"HELMET"|"NECKLACE"|"LEGGINGS"|"POTION"|"RELIK"|"RING"|"SCROLL"|"SPEAR"|"WAND"} CraftableItemType A specific type of item craftable using professions
 */

/**
 * A material to be used while crafting an item
 * @typedef {Object} CraftingMaterial
 * @property {string} item The material name
 * @property {number} amount The amount required
 */

/**
 * A recipe from the API
 * @class
 */
module.exports = class Recipe {
    constructor(v) {
        /**
         * The ID of the recipe
         * @type {string}
         */
        this.id = v.id.toUpperCase();
        /**
         * The type of the resulting item
         * @type {CraftableItemType}
         */
        this.type = v.type;
        /**
         * The required crafting skill
         * @type {CraftingSkill}
         */
        this.skill = removeTheBritish(v.skill);
        /**
         * The level range the resulting item may be in
         * @type {import("../util").Range}
         */
        this.level = {
            min: v.level.minimum,
            max: v.level.maximum
        };
        /**
         * The required materials to craft the item
         * @type {CraftingMaterial[]}
         */
        this.materials = v.materials.slice();
        /**
         * The health of the resulting armor piece
         * @type {?import("../util").Range}
         */
        this.health;
        /**
         * The damage of the resulting weapon
         * @type {?import("../util").Range}
         */
        this.damage;
        /**
         * The durability of the resulting weapon, armor piece or accessory
         * @type {?import("../util").Range}
         */
        this.durability;
        /**
         * The duration of the resulting consumable
         * @type {?import("../util").Range}
         */
        this.duration;
        /**
         * The duration of the consumable if no ingredients are used
         * @type {?import("../util").Range}
         */
        this.basicDuration;
        if (["ARMORING", "TAILORING", "WEAPONSMITHING", "WOODWORKING", "JEWELING"].includes(this.skill)) {
            if (["ARMORING", "TAILORING"].includes(this.skill)) {
                this.health = {
                    min: v.healthOrDamage.minimum,
                    max: v.healthOrDamage.maximum
                };
            } else if (["WEAPONSMITHING", "WOODWORKING"].includes(this.skill)) {
                this.damage = {
                    min: v.healthOrDamage.minimum,
                    max: v.healthOrDamage.maximum
                }
            }
            this.durability = {
                min: v.durability.minimum,
                max: v.durability.maximum
            };
        } else if (["COOKING", "ALCHEMISM", "SCRIBING"].includes(this.skill)) {
            this.duration = {
                min: v.duration.minimum,
                max: v.duration.maximum
            };
            this.basicDuration = {
                min: v.basicDuration.minimum,
                max: v.basicDuration.maximum
            };
        }
    }
}
