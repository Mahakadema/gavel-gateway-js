
const { removeTheBritish } = require("../util");

class Recipe {
    constructor(v) {
        this.id = v.id.toUpperCase();
        this.type = v.type;
        this.skill = removeTheBritish(v.skill);
        this.level = {
            min: v.level.minimum,
            max: v.level.maximum
        };
        this.materials = v.materials.slice();
        this.health;
        this.damage;
        this.durability;
        this.duration;
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

module.exports = Recipe;
