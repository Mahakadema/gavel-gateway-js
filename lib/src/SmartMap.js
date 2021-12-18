
module.exports = class SmartMap extends Map {
    constructor () {
        super();
    }

    /**
     * Removes all entries from the Map, then returns the map
     * @param {Function} filterFn A function taking three arguments `value`, `key`, and `map`. All entries matching this filter will be removed
     * @param {Any} thisArg What the `this` keyword should refer to in the filter
     */
    sweep(filterFn, thisArg = null) {
        const fn = filterFn.bind(thisArg);
        for (const key of this.keys()) {
            if (fn(this.get(key), key, this)) {
                this.delete(key);
            }
        }
        return this;
    }
}