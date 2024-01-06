
const WynncraftAPIError = require("./WynncraftAPIError.js");

module.exports = class MultipleChoicesError extends WynncraftAPIError {
    constructor (message, choices = []) {
        super(message);
        this.choices = choices;
        if (Error.captureStackTrace)
            Error.captureStackTrace(this, MultipleChoicesError);
    }
}
