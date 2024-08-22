
const { CDN_URL, icon2Sprite } = require("../util.js");

class Ability {
    constructor(id, data) {
        this.id = id;
        this.name = data.name
        this.description = data.description.map(v => v.trimEnd()).join("\n");
        this.parents = [];
        this.children = data.links?.filter(v => v.trim()) ?? [];
        this.cost = data.requirements.ABILITY_POINTS ?? 0;
        this.requiredAbility = data.requirements.NODE ?? null;
        this.archetypeRequirement = data.requirements.ARCHETYPE ? {
            name: data.requirements.ARCHETYPE.name,
            amount: data.requirements.ARCHETYPE.amount
        } : null;
        this.locks = data.locks?.filter(v => v.trim()) ?? [];
        this.lockedBy = [];
        this.location = {
            x: data.coordinates.x,
            y: data.coordinates.y + (data.page - 1) * 6,
            page: data.page
        };
        this.sprite = icon2Sprite(data.icon);
        this.passiveIconUrl = CDN_URL + `/nextgen/abilities/2.1/nodes/${this.sprite.name}.png`;
        this.activeIconUrl = CDN_URL + `/nextgen/abilities/2.1/nodes/${this.sprite.name}_active.png`;
    }
}

module.exports = Ability;
