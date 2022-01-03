
const minecraftIds = require("../../data/minecraftIds.json");
const identifications = require("../../data/identifications.json");

class Ingredient {
    constructor(v) {
        this.name = v.name;
        this.displayName = v.displayName ?? v.name;
        this.sprite = {
            id: minecraftIds.strings[v.sprite.id],
            numericalId: v.sprite.id,
            damage: v.sprite.damage
        }

        this.tier = v.tier;
        this.level = v.level;
        this.skills = v.skills.slice();

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
        this.positionModifiers = {
            left: v.ingredientPositionModifiers.left,
            right: v.ingredientPositionModifiers.right,
            above: v.ingredientPositionModifiers.above,
            under: v.ingredientPositionModifiers.under,
            touching: v.ingredientPositionModifiers.touching,
            notTouching: v.ingredientPositionModifiers.notTouching
        };
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

module.exports = Ingredient;
