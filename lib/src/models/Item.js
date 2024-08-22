
const sprites = require("../../data/sprites.json");
const { matId2Sprite, decolonize, icon2Sprite } = require("../util.js");

const MINECRAFT_TEXTURE_URL = "https://textures.minecraft.net/texture/";

class Item {
    constructor(displayName, v) {
        this.name = v.internalName;
        this.displayName = displayName;

        this.category = decolonize(v.type.toUpperCase());
        this.type = v[`${v.type}Type`].toUpperCase();
        this.tier = v.rarity.toUpperCase();
        this.set = v.set?.toUpperCase() ?? null;
        this.identified = v.identified ?? false;
        this.craftsmanAllowed = v.allowCraftsman ?? false;
        this.dropType = v.dropRestriction?.toUpperCase() ?? "NORMAL"; // TODO: remove this coalescing op
        this.restriction = v.restrictions?.toUpperCase().replace(" ", "_") ?? null;
        this.lore = v.lore ?? "";

        // probably change it to sprite on legacy ids and skulls, and icon: { name: string, url: string } on attribute format

        // It is possible neither v.material nor v.armorType nor v.skin is given,
        // in that case the default skin for the item type is used
        const defaultSpriteName = this.category === "ARMOR" ? `${v.armourMaterial.toUpperCase()}_${this.type}` : `${this.type}_DEFAULT_0`;
        const defaultSprite = sprites[defaultSpriteName];
        this.sprite = {
            type: "LEGACY",
            id: defaultSprite.id,
            numericalId: defaultSprite.numericalId,
            damage: defaultSprite.damage
        };
        this.skin = null;
        if (v.icon?.format === "skin") { // skin has higher prioritization as material values
            const sprite = sprites.PLAYER_HEAD;
            this.sprite.type = "LEGACY";
            this.sprite.id = sprite.id;
            this.sprite.numericalId = sprite.numericalId;
            this.sprite.damage = sprite.damage;
            this.skin = {
                uuid: null,
                name: null,
                url: MINECRAFT_TEXTURE_URL + v.icon.value
            };
        } else if (v.icon?.format === "legacy") {
            this.sprite = matId2Sprite(v.icon.value);
        } else if (v.icon) {
            this.sprite = icon2Sprite(v.icon);
        }
        // TODO: fix color
        this.color = null;
        // 160,101,64 is default color
        if (v.armourColor && v.armourColor !== "160,101,64") {
            const colors = v.armourColor.split(",");
            this.color = colors.map(v1 => Number(v1));
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
            health: v.base?.baseHealth ?? null,
            earthDefence: v.base?.baseEarthDefense ?? null,
            thunderDefence: v.base?.baseThunderDefense ?? null,
            waterDefence: v.base?.baseWaterDefense ?? null,
            fireDefence: v.base?.baseFireDefense ?? null,
            airDefence: v.base?.baseAirDefense ?? null,
            // TODO: fix damages
            // damage: v.base?.damage ? { ...v.base.damage } : null,
            // earthDamage: v.base?.earthDamage ? { ...v.base.earthDamage } : null,
            // thunderDamage: v.base?.thunderDamage ? { ...v.base.thunderDamage } : null,
            // waterDamage: v.base?.waterDamage ? { ...v.base.waterDamage } : null,
            // fireDamage: v.base?.fireDamage ? { ...v.base.fireDamage } : null,
            // airDamage: v.base?.airDamage ? { ...v.base.airDamage } : null,
            damage: v.base?.baseDamage ? v.base.baseDamage : null,
            earthDamage: v.base?.baseEarthDamage ? v.base.baseEarthDamage : null,
            thunderDamage: v.base?.baseThunderDamage ? v.base.baseThunderDamage : null,
            waterDamage: v.base?.baseWaterDamage ? v.base.baseWaterDamage : null,
            fireDamage: v.base?.baseFireDamage ? v.base.baseFireDamage : null,
            airDamage: v.base?.baseAirDamage ? v.base.baseAirDamage : null,
            attackSpeed: v.attackSpeed?.toUpperCase() ?? null
        };

        // TODO: ensure min is defined
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
        this.majorId = null;
        if (v.majorIds) {
            const mIdName = Object.getOwnPropertyNames(v.majorIds)[0];
            this.majorId = {
                name: mIdName,
                description: v.majorIds[mIdName]
            };
        }

        this.obtaining = v.dropMeta ? {
            source: v.dropMeta.name,
            type: Array.isArray(v.dropMeta.type) ? v.dropMeta.type[1].toUpperCase() : v.dropMeta.type.toUpperCase(),
            event: v.dropMeta.event?.toUpperCase() ?? null,
            coordinates: v.dropMeta.coordinates.some(v => v !== 99999) ? v.dropMeta.coordinates.slice() : null,
        } : null
    }
}

module.exports = Item;
