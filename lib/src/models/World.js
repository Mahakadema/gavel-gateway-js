
module.exports = class World {
    constructor(v) {
        
        this.name = v[0];

        if (/^WC[0-9]+$/.test(v[0])) {
            this.worldType = "WYNNCRAFT";
        } else if (/^YT$/.test(v[0])) {
            this.worldType = "MEDIA";
        } else {
            this.worldType = "OTHER";
        }
        
        this.players = v[1].slice();
    }
}
