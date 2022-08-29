
class MapLocation {
    constructor(v) {
        this.name = ["Junk", "Emerald", "Armour"].includes(v.name) ? `${v.name} Merchant` : v.name;
        this.icon = v.icon;
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
    }
}

module.exports = MapLocation;