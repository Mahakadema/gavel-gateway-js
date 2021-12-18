
module.exports = class WynncraftAPIError extends Error {
    constructor (message) {
        super(message);
        if (Error.captureStackTrace) Error.captureStackTrace(this, WynncraftAPIError);
    }
}
