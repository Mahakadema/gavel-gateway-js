
/**
 * @typedef {"WYNNCRAFT"|"MEDIA"|"OTHER"} WorldType A server type found on Wynncraft
 */

/**
 * Represents a world or server on Wynncraft
 * @class
 */
module.exports = class World {
    constructor(v) {

        /**
         * The identifier of the world
         * @type {string}
         */
        this.name = v[0];

        /**
         * The type of the world
         * @type {WorldType}
         */
        this.worldType;
        if (/^WC[0-9]+$/.test(v[0])) {
            this.worldType = "WYNNCRAFT";
        } else if (/^YT$/.test(v[0])) {
            this.worldType = "MEDIA";
        } else {
            this.worldType = "OTHER";
        }

        /**
         * An array of player names who are online on the world; sorted in
         * ascending order of login time
         * @type {string[]}
         */
        this.players = v[1].slice();
    }
}
