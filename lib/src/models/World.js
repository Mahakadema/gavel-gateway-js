
class World {
    constructor(name, players) {

        this.name = name;

        this.worldType;
        if (/^WC[0-9]+$/.test(name)) {
            this.worldType = "WYNNCRAFT";
        } else if (/^YT$/.test(name)) {
            this.worldType = "MEDIA";
        } else {
            this.worldType = "OTHER";
        }

        this.players = players.slice();
    }
}

module.exports = World;
