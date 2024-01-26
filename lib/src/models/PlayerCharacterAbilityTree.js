
const { semVerFromHeader } = require("../util.js");
const AbilityConnectorNode = require("./AbilityConnectorNode.js");
const BaseAPIObject = require("./BaseAPIObject.js");

const VERSION = "1.0.0";

class PlayerCharacterAbilityTree extends BaseAPIObject {
    constructor(rawresult, params) {
        super(rawresult.requestedAt, rawresult.respondedAt, rawresult.receivedAt, rawresult.dataTimestamp, semVerFromHeader(rawresult.headers["version"]), VERSION, params.source);

        const b = rawresult.body;

        this.player = params.player;
        this.character = params.character;
        this.classBaseType = params.tree.classBaseType;
        this.pages = b.pages;
        this.archetypes = params.tree.archetypes;
        const mapArr = b.map.sort((a, b) => a.coordinates.y - b.coordinates.y || a.coordinates.x - b.coordinates.x)
            .filter((v, i, a) => v.coordinates.x !== a[i - 1]?.coordinates.x || v.coordinates.y !== a[i - 1]?.coordinates.y || v.meta.icon !== a[i - 1]?.meta.icon);
        this.abilities = params.tree.abilities;
        this.unlockedAbilities = mapArr.filter(v => v.type === "ability").map(raw => this.abilities.find(ability => ability.id === raw.meta.id));
        this.map = params.tree.map;
        this.unlockedNodes = mapArr.map(raw => raw.type === "ability" ? this.unlockedAbilities.find(ability => ability.id === raw.meta.id) : new AbilityConnectorNode(raw));
    }
}

module.exports = PlayerCharacterAbilityTree;
