
const { CDN_URL, icon2Sprite } = require("../util.js");

class Aspect {
    constructor(data) {
        this.name = data.name;
        this.rarity = data.rarity.toUpperCase();
        this.class = data.requiredClass.toUpperCase();
        this.tiers = Object.getOwnPropertyNames(data.tiers).sort((a, b) => Number(a) - Number(b)).map(v => ({
            threshold: data.tiers[v].threshold,
            description: data.tiers[v].description.slice()
        }));
        this.sprite = icon2Sprite(data.icon);
        this.iconUrl = CDN_URL + `/nextgen/abilities/2.1/aspects/${this.sprite.name}.png`;
    }
}

module.exports = Aspect;
