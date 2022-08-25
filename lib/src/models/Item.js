
const minecraftIds = require("../../data/minecraftIds.json");
const sprites = require("../../data/sprites.json");
const identifications = require("../../data/identifications.json");
const majorIds = require("../../data/majorIds.json");

class Item {
    constructor(v) {
        this.name = v.name;
        this.displayName = v.displayName ?? v.name;

        this.type = (v.type ?? v.accessoryType).toUpperCase();
        this.category = v.category.toUpperCase();
        this.tier = v.tier.toUpperCase();
        this.set = v.set?.toUpperCase() ?? null;
        this.identified = v.identified ?? false;

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
            const parts = v.material.split(":");
            this.sprite.id = minecraftIds.strings[parts[0]];
            this.sprite.numericalId = Number(parts[0]);
            this.sprite.damage = Number(parts[1] ?? 0);
        }
        this.color = null;
        // 160,101,64 is default color
        if (v.armorColor && v.armorColor !== "160,101,64" && v.armorColor !== 0) {
            const colors = v.armorColor.split(",");
            this.color = colors.map(v1 => Number(v1));
        }
        this.lore = v.addedLore ?? "";
        this.skin = null;
        if (v.skin) {
            const skin = JSON.parse(Buffer.from(v.skin, "base64").toString("ascii"));
            this.skin = {
                uuid: skin.profileId ?? null,
                name: skin.profileName ?? null,
                url: skin.textures.SKIN.url
            };
        }

        this.dropType = v.dropType.toUpperCase();
        this.restriction = v.restrictions?.toUpperCase().replace(" ", "_") ?? null;
        this.craftsmanAllowed = v.allowCraftsman ?? false;
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

        const dmg = (typeof v.damage === "number" ? `${v.damage}-${v.damage}` : v.damage)?.split("-");
        const edmg = (typeof v.earthDamage === "number" ? `${v.earthDamage}-${v.earthDamage}` : v.earthDamage)?.split("-");
        const tdmg = (typeof v.thunderDamage === "number" ? `${v.thunderDamage}-${v.thunderDamage}` : v.thunderDamage)?.split("-");
        const wdmg = (typeof v.waterDamage === "number" ? `${v.waterDamage}-${v.waterDamage}` : v.waterDamage)?.split("-");
        const fdmg = (typeof v.fireDamage === "number" ? `${v.fireDamage}-${v.fireDamage}` : v.fireDamage)?.split("-");
        const admg = (typeof v.airDamage === "number" ? `${v.airDamage}-${v.airDamage}` : v.airDamage)?.split("-");
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
        this.majorIds = [];
        if (v.majorIds) {
            this.majorIds = v.majorIds.map(v1 => majorIds.find(v2 => v2.apiName === v1)?.name ?? v1);
        }
    }
}

module.exports = Item;
