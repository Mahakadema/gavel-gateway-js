
class AbilityConnectorNode {
    constructor(v, aMap) {
        this.links = v.family.map(v => aMap.get(v.toLowerCase()));
        this.location = {
            x: v.coordinates.x,
            y: v.coordinates.y,
            page: Math.ceil(v.coordinates.y / 6)
        };
        this.direction = /connector_(?<dir>.*)/.exec(v.meta.icon).groups.dir.toUpperCase();
    }
}

module.exports = AbilityConnectorNode;
