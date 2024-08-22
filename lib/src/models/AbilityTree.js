
const { icon2Sprite } = require("../util.js");
const Ability = require("./Ability.js");
const AbilityConnectorNode = require("./AbilityConnectorNode.js");
const BaseAPIObject = require("./BaseAPIObject.js");

class AbilityTree extends BaseAPIObject {
    constructor(rawTree, rawMap, params) {
        super(params.requestedAt, params.respondedAt, params.receivedAt, params.dataTimestamp, params.apiVersion, params.libVersion, params.source);

        const t = rawTree.body;
        const m = rawMap.body;

        this.classBaseType = params.class;
        this.archetypes = Object.getOwnPropertyNames(t.archetypes)
            .sort((a, b) => t.archetypes[a].slot - t.archetypes[b].slot)
            .map(id => ({
                id,
                name: t.archetypes[id].name,
                description: t.archetypes[id].description,
                shortDescription: t.archetypes[id].shortDescription,
                sprite: icon2Sprite(t.archetypes[id].icon),
            }))
        this.abilities = Object.getOwnPropertyNames(t.pages)
            .flatMap(i => Object.getOwnPropertyNames(t.pages[i]).map(v => new Ability(v, t.pages[i][v])))
            .sort((a, b) => a.location.y - b.location.y || a.location.x - b.location.x);
        const aMap = new Map(this.abilities.map(v => [v.id.toLowerCase(), v]));
        for (const a of this.abilities) {
            a.children = a.children.map(v => {
                const c = aMap.get(v.toLowerCase());
                if (c)
                    c.parents.push(a);
                return c;
            }).filter(v => v);
            a.locks = a.locks.map(v => {
                const l = aMap.get(v.toLowerCase());
                if (l)
                    l.lockedBy.push(a);
                return l;
            }).filter(v => v);
            if (a.requiredAbility)
                a.requiredAbility = aMap.get(a.requiredAbility.toLowerCase()) ?? null;
        }
        const mapArr = Object.getOwnPropertyNames(m)
            .flatMap(v => m[v])
            .sort((a, b) => a.coordinates.y - b.coordinates.y || a.coordinates.x - b.coordinates.x)
            .filter((v, i, a) => v.coordinates.x !== a[i - 1]?.coordinates.x || v.coordinates.y !== a[i - 1]?.coordinates.y || v.meta.icon !== a[i - 1]?.meta.icon);
        this.map = mapArr.map(v => v.type === "ability" ? aMap.get(v.meta.id.toLowerCase()) : new AbilityConnectorNode(v, aMap));
    }
}

module.exports = AbilityTree;
