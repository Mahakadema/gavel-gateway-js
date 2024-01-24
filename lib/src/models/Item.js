
const sprites = require("../../data/sprites.json");
const { matId2Sprite } = require("../util.js");

const MINECRAFT_TEXTURE_URL = "https://textures.minecraft.net/texture/";

class Item {
    constructor(displayName, v) {
        this.name = v.internalName;
        this.displayName = displayName;

        this.type = (v.type ?? v.accessoryType).toUpperCase();
        this.category = v.accessoryType ? "ACCESSORY" :
            ["HELMET", "CHESTPLATE", "LEGGINGS", "BOOTS"].includes(this.type) ? "ARMOR" : "WEAPON";
        this.tier = v.tier.toUpperCase();
        this.set = v.set?.toUpperCase() ?? null;
        this.identified = v.identified ?? false;
        this.craftsmanAllowed = v.allowCraftsman ?? false;
        this.dropType = v.dropRestriction.toUpperCase();
        this.restriction = v.restrictions?.toUpperCase().replace(" ", "_") ?? null;
        this.lore = v.lore ?? "";

        // It is possible neither v.material nor v.armorType nor v.skin is given,
        // in that case the default skin for the item type is used
        const defaultSpriteName = this.category === "ARMOR" ? `${v.armorType.toUpperCase()}_${this.type}` : `${this.type}_DEFAULT_0`;
        const defaultSprite = sprites[defaultSpriteName];
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
            this.sprite = matId2Sprite(v.material);
        }
        this.color = null;
        // 160,101,64 is default color
        if (v.armorColor && v.armorColor !== "160,101,64") {
            const colors = v.armorColor.split(",");
            this.color = colors.map(v1 => Number(v1));
        }

        this.skin = null;
        if (v.skin) {
            this.skin = {
                uuid: null,
                name: null,
                url: MINECRAFT_TEXTURE_URL + v.skin
            };
        }

        this.requirements = {
            level: v.requirements.level,
            quest: v.requirements.quest ?? null,
            class: v.requirements.classRequirement?.toUpperCase() ?? ["WARRIOR", "ARCHER", "MAGE", "ASSASSIN", "SHAMAN"][["SPEAR", "BOW", "WAND", "DAGGER", "RELIK"].indexOf(this.type)] ?? null,
            strength: v.requirements.strength ?? null,
            dexterity: v.requirements.dexterity ?? null,
            intelligence: v.requirements.intelligence ?? null,
            defence: v.requirements.defence ?? null,
            agility: v.requirements.agility ?? null
        };

        this.stats = {
            powderSlots: v.powderSlots ?? 0,
            health: v.base?.health ?? null,
            earthDefence: v.earthDefense ?? null,
            thunderDefence: v.thunderDefense ?? null,
            waterDefence: v.waterDefense ?? null,
            fireDefence: v.fireDefense ?? null,
            airDefence: v.airDefense ?? null,
            damage: v.base?.damage ? { ...v.base.damage } : null,
            earthDamage: v.base?.earthDamage ? { ...v.base.earthDamage } : null,
            thunderDamage: v.base?.thunderDamage ? { ...v.base.thunderDamage } : null,
            waterDamage: v.base?.waterDamage ? { ...v.base.waterDamage } : null,
            fireDamage: v.base?.fireDamage ? { ...v.base.fireDamage } : null,
            airDamage: v.base?.airDamage ? { ...v.base.airDamage } : null,
            attackSpeed: v.attackSpeed?.toUpperCase() ?? null
        };
        this.identifications = [];
        for (const idName of Object.getOwnPropertyNames(v.identifications ?? {})) {
                const idValue = v.identifications[idName];
                const id = {
                    name: idName,
                    base: typeof idValue === "number" ? idValue : idValue.raw,
                    min: typeof idValue === "number" ? idValue : idValue.min,
                    max: typeof idValue === "number" ? idValue : idValue.max,
                };
                if (id.min > id.max)
                    [id.min, id.max] = [id.max, id.min];
                this.identifications.push(id);
        }
        this.majorId = v.majorIds ? {
            name: v.majorIds.name,
            description: v.majorIds.description
        } : null;

        this.obtaining = v.dropMeta ? {
            source: v.dropMeta.name,
            type: Array.isArray(v.dropMeta.type) ? v.dropMeta.type[1].toUpperCase() : v.dropMeta.type.toUpperCase(),
            event: v.dropMeta.event?.toUpperCase() ?? null,
            coordinates: v.dropMeta.coordinates.some(v => v !== 99999) ? v.dropMeta.coordinates.slice() : null,
        } : null
    }
}

module.exports = Item;
