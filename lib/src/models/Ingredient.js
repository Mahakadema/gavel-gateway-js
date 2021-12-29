
const minecraftIds = require("../../data/minecraftIds.json");
const identifications = require("../../data/identifications.json");

/**
 * The IDs only effective on certain types of crafted items
 * @typedef {Object} RestrictedIdModifiers
 * @property {number} durability The durability modifier, only applies to non-consumable items
 * @property {number} strengthRequirement The strength requirement modifier, only applies to non-consumable items
 * @property {number} dexterityRequirement The dexterity requirement modifier, only applies to non-consumable items
 * @property {number} intelligenceRequirement The intelligence requirement modifier, only applies to non-consumable items
 * @property {number} defenceRequirement The defence requirement modifier, only applies to non-consumable items
 * @property {number} agilityRequirement The agility requirement modifier, only applies to non-consumable items
 * @property {number} attackSpeed The attack speed modifier, only applies to weapons
 * @property {number} powderSlots The powder slot modifier, only applies to armor and weapons
 * @property {number} duration The duration modifier, only applies to consumables
 * @property {number} charges The charges modifier, only applies to consumables
 */

/**
 * The crafting grid position modifiers of an ingredient
 * @typedef {Object} PositionModifiers
 * @property {number} left The ID modifier to ingredients placed to the left of the ingredient
 * @property {number} right The ID modifier to ingredients placed to the right of the ingredient
 * @property {number} above The ID modifier to ingredients placed above the ingredient
 * @property {number} under The ID modifier to ingredients placed below the ingredient
 * @property {number} touching The ID modifier to ingredients touching the ingredient
 * @property {number} notTouching The ID modifier to ingredients not touching the ingredient
 */

/**
 * Represents an ingredient from the API
 * @class
 */
module.exports = class Ingredient {
    constructor(v) {
        /**
         * The name of the ingredient
         * @type {string}
         */
        this.name = v.name;
        /**
         * The name of the ingredient as it shows up in-game
         * @type {string}
         */
        this.displayName = v.displayName ?? v.name;
        /**
         * The visual sprite this ingredient uses
         * @type {import("../util").Sprite}
         */
        this.sprite = {
            id: minecraftIds.strings[v.sprite.id],
            numericalId: v.sprite.id,
            damage: v.sprite.damage
        }

        /**
         * The tier of the ingredient
         * @type {number}
         */
        this.tier = v.tier;
        /**
         * The minimum level of recipe required to use the ingredient
         * @type {number}
         */
        this.level = v.level;
        /**
         * The crafting professions this ingredient can be used for
         * @type {import("./Recipe").CraftingSkill[]}
         */
        this.skills = v.skills.slice();

        /**
         * The restricted ID modifiers of the ingredient
         * @type {RestrictedIdModifiers}
         */
        this.restrictedIds = {
            durability: v.itemOnlyIDs.durabilityModifier,
            strengthRequirement: v.itemOnlyIDs.strengthRequirement,
            dexterityRequirement: v.itemOnlyIDs.dexterityRequirement,
            intelligenceRequirement: v.itemOnlyIDs.intelligenceRequirement,
            defenceRequirement: v.itemOnlyIDs.defenceRequirement,
            agilityRequirement: v.itemOnlyIDs.agilityRequirement,
            attackSpeed: v.itemOnlyIDs.attackSpeedModifier ?? 0,
            powderSlots: v.itemOnlyIDs.powderSlotModifier ?? 0,
            duration: v.consumableOnlyIDs?.duration ?? 0,
            charges: v.consumableOnlyIDs?.charges ?? 0
        };
        /**
         * The crafting grid position modifiers
         * @type {PositionModifiers}
         */
        this.positionModifiers = {
            left: v.ingredientPositionModifiers.left,
            right: v.ingredientPositionModifiers.right,
            above: v.ingredientPositionModifiers.above,
            under: v.ingredientPositionModifiers.under,
            touching: v.ingredientPositionModifiers.touching,
            notTouching: v.ingredientPositionModifiers.notTouching
        };
        /**
         * The identifications of the ingredient
         * @type {import("./Item").Identification[]}
         */
        this.identifications = [];
        for (const id of identifications) {
            if (v.identifications[id.ingredientApiName]) {
                this.identifications.push({
                    name: id.name,
                    min: v.identifications[id.ingredientApiName].minimum,
                    max: v.identifications[id.ingredientApiName].maximum
                });
            }
        }
    }
}
