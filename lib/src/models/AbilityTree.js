
const { semVerFromHeader, matId2Sprite } = require("../util.js");
const Ability = require("./Ability.js");
const AbilityConnectorNode = require("./AbilityConnectorNode.js");
const BaseAPIObject = require("./BaseAPIObject.js");

const VERSION = "1.0.0";

class AbilityTree extends BaseAPIObject {
    constructor(rawMap, rawTree, params) {
        super(rawMap.requestedAt, rawMap.respondedAt, rawMap.receivedAt, rawMap.dataTimestamp, semVerFromHeader(rawMap.headers["version"]), versionOverride ?? VERSION, params.source)

        const t = rawTree.body;
        const m = rawMap.body;

        this.archetypes = Object.getOwnPropertyNames(t.archetypes)
            .sort((a, b) => t.archetypes[a].slot - t.archetypes[b].slot)
            .map(id => ({
                id,
                name: t.archetypes[id].name,
                description: t.archetypes[id].description,
                shortDescription: t.archetypes[id].shortDescription,
                sprite: matId2Sprite(t.archetypes[id].icon),
            }))
        this.abilities = Object.getOwnPropertyNames(t.pages)
            .flatMap(i => Object.getOwnPropertyNames(t.pages[i]).map(v => new Ability(v, t.pages[i][v])))
            .sort((a, b) => a.location.y - b.location.y || a.location.x - b.location.x);
        console.log(this.abilities.filter((v, i, a) => v.id === a[i - 1]?.id));
        const aMap = new Map(this.abilities.map(v => [v.id, v]));
        for (const a of this.abilities) {
            a.children.forEach((v, i) => {
                a.children[i] = aMap.get(v);
                a.children[i].parents.push(a);
            });
            a.locks.forEach((v, i) => {
                a.locks[i] = aMap.get(v);
                a.locks[i].lockedBy.push(a);
            });
            if (a.requiredAbility)
                a.requiredAbility = aMap.get(a.requiredAbility);
        }
        const mapArr = Object.getOwnPropertyNames(m.map).map(v => m.map[v])
            .sort((a, b) => a.coordinates.y - b.coordinates.y || a.coordinates.x - b.coordinates.x)
            .filter((v, i, a) => v.coordinates.x !== a[i - 1]?.coordinates.x || v.coordinates.y !== a[i - 1]?.coordinates.y || console.log(i, v));
        this.map = mapArr.map(v => v.type === "ability" ? aMap.get(v.meta.id) : new AbilityConnectorNode(v));
    }
}

module.exports = AbilityTree;
