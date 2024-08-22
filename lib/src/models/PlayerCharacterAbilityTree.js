
const { semVerFromHeader } = require("../util.js");
const AbilityConnectorNode = require("./AbilityConnectorNode.js");
const AbilityTree = require("./AbilityTree.js");

const VERSION = "2.0.0";

class PlayerCharacterAbilityTree extends AbilityTree {
    constructor(rawCharTree, rawTree, rawMap, params) {
        super(rawTree, rawMap, {
            class: params.class,
            requestedAt: rawCharTree.requestedAt,
            respondedAt: rawCharTree.respondedAt,
            receivedAt: rawCharTree.receivedAt,
            dataTimestamp: rawCharTree.dataTimestamp,
            apiVersion: semVerFromHeader(rawCharTree.headers["version"]),
            libVersion: VERSION,
            source: params.source
        });

        this.player = params.player;
        this.character = params.character;
        this.pages = 0;
        const mapArr = rawCharTree.body.sort((a, b) => a.coordinates.y - b.coordinates.y || a.coordinates.x - b.coordinates.x)
            .filter((v, i, a) => v.coordinates.x !== a[i - 1]?.coordinates.x || v.coordinates.y !== a[i - 1]?.coordinates.y || v.meta.icon !== a[i - 1]?.meta.icon);
        const aMap = new Map(this.abilities.map(v => [v.id.toLowerCase(), v]));
        this.unlockedAbilities = mapArr.filter(v => v.type === "ability").map(v => aMap.get(v.meta.id.toLowerCase()));
        this.unlockedNodes = mapArr.map(v => v.type === "ability" ? aMap.get(v.meta.id.toLowerCase()) : new AbilityConnectorNode(v, aMap));
        this.pages = Math.max(...this.unlockedNodes.map(v => v.location.page));
    }
}

module.exports = PlayerCharacterAbilityTree;
