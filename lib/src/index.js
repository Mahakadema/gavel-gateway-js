
 // Here because config.js has a circular dependency to this
/**
 * Removes all stored entries from cache and returns the amount of entries
 * cleared
 * @returns {number}
 */
module.exports.flushCache = function () {
    const size = cache.size;
    cache.clear();
    return size;
}

const WynncraftAPIError = require("./WynncraftAPIError.js");
const SmartMap = require("./SmartMap.js");
const {
    throwErr,
    parseBaseRequestOptions,
    parseRawRequestOptions,
    parsePlayerLeaderboardRequestOptions,
    parsePlayerRequestOptions,
    parseGuildRequestOptions,
    parseRecipeRequestOptions,
    parseIngredientRequestOptions,
    parseItemRequestOptions,
    randomString,
    sleep,
    _requestAPI,
    sweepArr
} = require("./util.js");

/**
 * Imports of Models at end of file to prevent circular dependency issues
 */

const identifications = require("../data/identifications.json");
const majorIds = require("../data/majorIds.json");
const minecraftIds = require("../data/minecraftIds.json");
const territories = require("../data/territories.json");
const sprites = require("../data/sprites.json");
const guildLevels = require("../data/guildLevels.json");

const configMod = require("./config.js");

/**
 * @readonly
 * @type {import("./util").LocalData}
 */
module.exports.data = { // these objects are copies of the cache, modifying them will not interfere with behaviour of the model
    identifications: identifications.map(v => { return { ...v }; }),
    majorIds: majorIds.map(v => { return { ...v }; }),
    minecraftIds: {
        strings: new Map(),
        nums: new Map()
    },
    territories: new Map(),
    sprites: new Map(),
    guildLevels: guildLevels.map(v => { return { ...v }; })
}

for (const t in territories) {
    if (territories.hasOwnProperty(t) && t !== "_default") {
        const newT = { ...territories[t] };
        newT.resources = { ...newT.resources };
        newT.connections = newT.connections.slice();
        module.exports.data.territories.set(t, newT);
    }
}

for (const s in sprites) {
    if (sprites.hasOwnProperty(s))
        module.exports.data.sprites.set(s, { ...sprites[s] });
}

for (const id in minecraftIds.strings) {
    if (minecraftIds.strings.hasOwnProperty(id))
        module.exports.data.minecraftIds.strings.set(id, minecraftIds.strings[id]);
}

for (const id in minecraftIds.nums) {
    if (minecraftIds.nums.hasOwnProperty(id))
        module.exports.data.minecraftIds.nums.set(id, minecraftIds.nums[id]);
}

// config
const config = configMod.config;

// ratelimit data
const ratelimits = configMod.ratelimits;

// queues
const ongoingRequests = new SmartMap(); // maps string:route => Object { route: String, queuedAt: Number, data: Promise<JSON> }:Data

// cache
const cache = new SmartMap();

// incrementally IDing requests
let currentRequestId = 0;

// housekeeping
function housekeeping() {
    const now = Date.now();

    let doCleanUp = false;

    // reset remaining requests if reset time was surpassed
    if (now > ratelimits.DEFAULT.reset + 1000) {
        ratelimits.DEFAULT.remaining = ratelimits.DEFAULT.limit;
        ratelimits.DEFAULT.reset += 60000;
        doCleanUp = true;
    }
    for (const key of config.apiKeys) {
        if (now > ratelimits[key.key].reset + 1000) {
            ratelimits[key.key].remaining = ratelimits[key.key].limit;
            ratelimits[key.key].reset += ratelimits[key.key].interval;
        }
    }

    // clear out old cache entries
    if (doCleanUp)
        cache.sweep(v => v.timestamp + v.cacheFor < now);

    // desync time keeping
    if (lastTimeSync + 3600000 < now) {
        lastTimeSync = now;
        const reqStart = Date.now();
        Promise.all([
            module.exports.fetchRaw({ route: `https://api.wynncraft.com/v2/leaderboards/player/solo/${randomString(32)}`, interpret: false }),
            module.exports.fetchRaw({ route: `https://api.wynncraft.com/v2/leaderboards/player/solo/${randomString(32)}`, interpret: false }),
            module.exports.fetchRaw({ route: `https://api.wynncraft.com/v2/leaderboards/player/solo/${randomString(32)}`, interpret: false }),
            module.exports.fetchRaw({ route: `https://api.wynncraft.com/v2/leaderboards/player/solo/${randomString(32)}`, interpret: false }),
            module.exports.fetchRaw({ route: `https://api.wynncraft.com/v2/leaderboards/player/solo/${randomString(32)}`, interpret: false })
        ])
            .then(arr => {
                const min = arr.reduce((p, c) => Math.min(p, reqStart - c.timestamp), Number.MAX_SAFE_INTEGER);
                timeDisparity = min;
            })
            .catch(e => lastTimeSync = 0);
    }
}

/**
 * Returns information on the ratelimit
 * @returns {import("./util").Ratelimit}
 */
module.exports.ratelimit = function () {
    const now = Date.now();

    const channels = [];
    if (config.apiKeys.length > 0) {
        for (const key of config.apiKeys) {
            channels.push({
                apiKey: key.key,
                total: ratelimits[key.key].limit,
                remaining: ratelimits[key.key].remaining - ratelimits[key.key].ongoingRequestsAmount,
                reset: Math.max(0, ratelimits[key.key].reset - now),
                queued: ratelimits[key.key].queue.length + ratelimits[key.key].priorityQueue.length
            });
        }
    } else {
        channels.push({
            apiKey: null,
            total: ratelimits.DEFAULT.limit,
            remaining: ratelimits.DEFAULT.remaining - ratelimits.DEFAULT.ongoingRequestsAmount,
            reset: Math.max(0, ratelimits.DEFAULT.reset - now),
            queued: ratelimits.DEFAULT.queue.length + ratelimits.DEFAULT.priorityQueue.length
        });
    }

    return {
        apiKeys: config.apiKeys.length,
        channels: channels,
        totalOngoing: ratelimits.GLOBAL.ongoingRequestsAmount,
        totalQueued: ratelimits.GLOBAL.queuedAmount
    };
};

/**
 * Merges the given options into the config and returns the full config
 * @param {import("./config").ConfigOptions} [config] A ConfigOptions object containing all settings to be set
 * @returns {import("./config").Config}
 */
module.exports.setConfig = configMod.set;

/**
 * Returns a raw API response of the requested route
 * @param {import("./util").RawRequestOptions|import("./util").WynncraftAPIRoute} options The options for the request, or a route to request
 * @returns {Promise<JSON>}
 */
module.exports.fetchRaw = function (options = {}) {
    const now = Date.now();

    housekeeping();

    // parse options
    if (options === null)
        throw new TypeError("Options may not be null");

    const parsedOptions = parseRawRequestOptions(options);

    if (parsedOptions.allowStacking) {
        // if request is already in progress, return it instead of queuing new
        const req = ongoingRequests.get(parsedOptions.route);
        if (req)
            return config.reuseJson ? req.data : req.data.then(v => JSON.parse(JSON.stringify(v))); // deep copy data to rule out downstream code interfering with one another

        // if request is already queued, return it instead of queueing new
        for (const key of config.apiKeys) {
            let requestIndex = ratelimits[key.key].queue.findIndex(v => v.route === parsedOptions.route);
            if (requestIndex >= 0) {
                const queuedRequest = ratelimits[key.key].queue[requestIndex];
                if (parsedOptions.priority) { // move request to priority queue because second request overwrote queue prioritization
                    ratelimits[key.key].queue.splice(requestIndex, 1);
                    ratelimits[key.key].priorityQueue.push(queuedRequest);
                    queuedRequest.priority = true;
                }
                return config.reuseJson ? queuedRequest.data : queuedRequest.data.then(v => JSON.parse(JSON.stringify(v)));
            } else {
                const queuedRequest = ratelimits[key.key].priorityQueue.find(v => v.route === parsedOptions.route);
                if (queuedRequest) {
                    return config.reuseJson ? queuedRequest.data : queuedRequest.data.then(v => JSON.parse(JSON.stringify(v)));
                }
            }
        }
    }

    // return from cache if enabled
    if (parsedOptions.allowCache) {
        const data = cache.get(parsedOptions.route);
        if (data && data.timestamp + data.cacheFor > now)
            return (async () => config.reuseJson ? data.raw : JSON.parse(data.raw))();
    }

    currentRequestId++;
    const request = {
        id: currentRequestId,
        route: parsedOptions.route,
        queuedAt: now,
        priority: parsedOptions.priority,
        data: undefined,
    };

    // choose which ratelimit (API key) to use
    const ratelimitsToChooseFrom = [];
    if (parsedOptions.apiKey) { // forced API key given
        ratelimitsToChooseFrom.push(ratelimits[parsedOptions.apiKey]);
    } else if (config.apiKeys.length > 0) { // select best option from available ones
        for (const key of config.apiKeys) {
            ratelimitsToChooseFrom.push(ratelimits[key.key]);
        }
        ratelimitsToChooseFrom.sort((a, b) => (b.remaining - b.ongoingRequestsAmount) - (a.remaining - a.ongoingRequestsAmount));
    } else { // select default (no key)
        ratelimitsToChooseFrom.push(ratelimits.DEFAULT);
    }
    const chosenRatelimit = ratelimitsToChooseFrom[0];

    // queue request if above ratelimit
    let queued = false;
    if (chosenRatelimit.remaining - chosenRatelimit.ongoingRequestsAmount <= 0 || ratelimits.GLOBAL.ongoingRequestsAmount > 50) { // ISPs often block incoming requests if they reach a high amount per second, throttle to prevent that
        if (ratelimits.GLOBAL.queuedAmount >= config.maxQueueLength) {
            throw new RangeError("Maximum queue length exceeded");
        }
        if (parsedOptions.priority) {
            chosenRatelimit.priorityQueue.push(request);
        } else {
            chosenRatelimit.queue.push(request);
        }
        ratelimits.GLOBAL.queuedAmount++;
        queued = true;
    }

    request.data = (async () => {
        if (queued) {
            // delay request while per-second requests are too high
            while (ratelimits.GLOBAL.ongoingRequestsAmount > 50)
                await sleep(500);
            // delay request in long increments until ratelimit expired, then do fast increments
            if (request.priority) {
                while (chosenRatelimit.remaining - chosenRatelimit.ongoingRequestsAmount <= 0 || chosenRatelimit.priorityQueue[0].id !== request.id) {
                    await sleep(10);
                    if (chosenRatelimit.remaining - chosenRatelimit.ongoingRequestsAmount <= 0) {
                        await sleep(500);
                        if (chosenRatelimit.reset < Date.now()) {
                            chosenRatelimit.remaining = chosenRatelimit.limit;
                            chosenRatelimit.reset += chosenRatelimit.interval;
                        }
                    }
                }
                chosenRatelimit.priorityQueue.splice(chosenRatelimit.priorityQueue.findIndex(v => v.id === request.id));
            } else {
                while (chosenRatelimit.remaining - chosenRatelimit.ongoingRequestsAmount <= 0 || chosenRatelimit.priorityQueue.length > 0 || chosenRatelimit.queue[0].id !== request.id) {
                    await sleep(10);
                    if (chosenRatelimit.remaining - chosenRatelimit.ongoingRequestsAmount <= 0) {
                        await sleep(500);
                        if (chosenRatelimit.reset < Date.now()) {
                            chosenRatelimit.remaining = chosenRatelimit.limit;
                            chosenRatelimit.reset += 60000;
                        }
                    }
                }
                chosenRatelimit.queue.splice(chosenRatelimit.queue.findIndex(v => v.id === request.id));
            }
            ratelimits.GLOBAL.queuedAmount--;
        }

        // mark request as ongoing
        ongoingRequests.set(request.route, request);
        ratelimits.GLOBAL.ongoingRequestsAmount++;
        chosenRatelimit.ongoingRequestsAmount++;

        // fetch data
        const data = await _requestAPI(request.route, chosenRatelimit.value, parsedOptions.retries, parsedOptions.timeout).catch(throwErr);

        ongoingRequests.delete(request.route);
        ratelimits.GLOBAL.ongoingRequestsAmount--;
        chosenRatelimit.ongoingRequestsAmount--;

        // update ratelimit
        if (data.headers.get("ratelimit-limit")) {
            const oldRemaining = chosenRatelimit.remaining;
            chosenRatelimit.remaining = Math.max(0, Math.min(chosenRatelimit.remaining, Number(data.headers.get("ratelimit-remaining"))));
            if (chosenRatelimit.remaining !== oldRemaining)
                chosenRatelimit.reset = Date.now() + Number(data.headers.get("ratelimit-reset")) * 1000;
        }

        /**
         * interpret data + sanity check ratelimit
         */

        const content = data.isJson ? data.body : JSON.parse(data.body);

        // API requests hit Ratelimit
        if (content.message === "API rate limit exceeded") {
            chosenRatelimit.remaining = 0;
            if (parsedOptions.interpret) {
                throw new WynncraftAPIError(content.message);
            }
        }

        if (parsedOptions.interpret) {
            // reject if version disparity
            if (!parsedOptions.ignoreVersion && options.routeVersion) {
                if (content.request && content.request.version !== options.routeVersion)
                    throw new WynncraftAPIError(`Version Error: Unable to handle legacy API version ${content.request.version}`);
                if (content.version && content.version !== options.routeVersion)
                    throw new WynncraftAPIError(`Version Error: Unable to handle v2 API version ${content.version}`);
            }

            // failed legacy request
            if (content.error) {
                if (content.error === "Guild not found")
                    return null;
                throw new WynncraftAPIError(content.error);
            }

            // tried to access a non-existent route
            if (content.status === 404) {
                throw new WynncraftAPIError("Route Not Found");
            }

            // failed v2 request
            if (content.code !== undefined && content.code !== 200) {
                // filter players not found (response status is 400)
                if (content.kind?.startsWith("wynncraft/player/") && data.status === 400)
                    return null;
                throw new WynncraftAPIError(`${content.code}: ${content.message ?? "Unknown Error"}`);
            }
        }

        // cache result
        if (config.reuseJson === data.isJson) { // only cache if config didn't just change (to avoid edge case bugs)
            cache.set(parsedOptions.route, {
                timestamp: ((content.timestamp ?? (content.request?.timestamp * 1000)) + timeDisparity) ?? Date.now(),
                cacheFor: parsedOptions.cacheFor,
                raw: data.body
            });
        }

        return content;
    })().catch(throwErr);

    return request.data;
};

/**
 * Fetches the guild leaderboard from the API; list is ordered in ascending
 * order of position (first place at start)
 * @param {import("./util").RequestOptions} [options] The options for the request
 * @returns {Promise<List<LeaderboardGuild>>}
 */
module.exports.fetchGuildLeaderboard = async function (options) {
    try {
        const now = Date.now();
        const parsedOptions = parseBaseRequestOptions(options);
        parsedOptions.route = config.routes.GUILD_LEADERBOARD.url;
        parsedOptions.routeVersion = config.routes.GUILD_LEADERBOARD.version;
        parsedOptions.cacheFor ??= config.routes.GUILD_LEADERBOARD.cacheTime;
        const dataAPI = await module.exports.fetchRaw(parsedOptions);
        const data = new List(dataAPI.data.map(v => new LeaderboardGuild(v)), { requestTimestamp: now, timestamp: dataAPI.request.timestamp * 1000 + timeDisparity });
        return data;
    } catch (e) {
        throwErr(e);
    }
};

/**
 * Fetches the player leaderboard from the API; list is ordered in ascending
 * order of position (first place at start)
 * @param {import("./util").PlayerLeaderboardRequestOptions|import("./util").PlayerTotalLeaderboardType} [options] The options for the request; or a type of `TOTAL` leaderboard to request
 * @returns {Promise<List<LeaderboardPlayer>>}
 */
module.exports.fetchPlayerLeaderboard = async function (options) {
    try {
        const now = Date.now();
        const parsedOptions = parsePlayerLeaderboardRequestOptions(options);
        const route = parsedOptions.apiVersion === "legacy" ? `PLAYER_${parsedOptions.routePart}_LEADERBOARD` : "PLAYER_LEADERBOARD";
        parsedOptions.route = config.routes[route].url.replace("%v", parsedOptions.routePart);
        parsedOptions.routeVersion = config.routes[route].version;
        parsedOptions.cacheFor ??= config.routes[route].cacheTime;
        const dataAPI = await module.exports.fetchRaw(parsedOptions);
        const arr = dataAPI.data.map(v => new LeaderboardPlayer(v));
        if (parsedOptions.apiVersion === "v2")
            arr.reverse();
        const data = new List(arr, { requestTimestamp: now, timestamp: parsedOptions.apiVersion === "legacy" ? dataAPI.request.timestamp * 1000 + timeDisparity : dataAPI.timestamp + timeDisparity });
        return data;
    } catch (e) {
        throwErr(e);
    }
};

/**
 * Fetches a player from the API; returns null if the player has never logged into Wynncraft
 * @param {import("./util").PlayerRequestOptions|string} options The options for the request, or a player name or uuid
 * @returns {?Promise<Player>}
 */
module.exports.fetchPlayer = async function (options) {
    try {
        const now = Date.now();
        const parsedOptions = parsePlayerRequestOptions(options);
        parsedOptions.route = config.routes.PLAYER.url.replace("%v", parsedOptions.player);
        parsedOptions.routeVersion = config.routes.PLAYER.version;
        parsedOptions.cacheFor ??= config.routes.PLAYER.cacheTime;
        const dataAPI = await module.exports.fetchRaw(parsedOptions);
        const data = dataAPI === null ? null : new Player(dataAPI, { requestTimestamp: now, timeDisparity: timeDisparity });
        return data;
    } catch (e) {
        throwErr(e);
    }
};

/**
 * Fetches a guild from the API; returns null if the guild doesn't exist
 * @param {import("./util").GuildRequestOptions|string} options The options for the request, or a guild name to request
 * @returns {?Promise<Guild>}
 */
module.exports.fetchGuild = async function (options) {
    try {
        const now = Date.now();
        const parsedOptions = parseGuildRequestOptions(options);
        parsedOptions.route = config.routes.GUILD.url.replace("%v", parsedOptions.guild);
        parsedOptions.routeVersion = config.routes.GUILD.version;
        parsedOptions.cacheFor ??= config.routes.GUILD.cacheTime;
        const [dataAPI, onlinePlayers, territories] = parsedOptions.fetchAdditionalStats ?
            await Promise.all([
                module.exports.fetchRaw(parsedOptions),
                module.exports.fetchOnlinePlayers({
                    apiKey: parsedOptions.apiKey,
                    allowCache: true,
                    priority: parsedOptions.priority,
                    retries: parsedOptions.retries,
                    timeout: parsedOptions.timeout,
                    cacheFor: config.routes.ONLINE_PLAYERS.cacheTime,
                    ignoreVersion: false
                }),
                module.exports.fetchTerritoryList({
                    apiKey: parsedOptions.apiKey,
                    allowCache: true,
                    priority: parsedOptions.priority,
                    retries: parsedOptions.retries,
                    timeout: parsedOptions.timeout,
                    cacheFor: config.routes.TERRITORY_LIST.cacheTime,
                    ignoreVersion: false
                })
            ]) :
            [await module.exports.fetchRaw(parsedOptions), null, null];
        const data = dataAPI === null ? null : new Guild(dataAPI, {
            requestTimestamp: now,
            timeDisparity: timeDisparity,
            fetchAdditionalStats: parsedOptions.fetchAdditionalStats,
            onlinePlayers: onlinePlayers,
            territories: territories
        });
        return data;
    } catch (e) {
        throwErr(e);
    }
};

/**
 * Fetches all guild names from the API
 * @param {import("./util").RequestOptions} [options] The options for the request
 * @returns {Promise<List<string>>}
 */
module.exports.fetchGuildList = async function (options) {
    try {
        const now = Date.now();
        const parsedOptions = parseBaseRequestOptions(options);
        parsedOptions.route = config.routes.GUILD_LIST.url;
        parsedOptions.routeVersion = config.routes.GUILD_LIST.version;
        parsedOptions.cacheFor ??= config.routes.GUILD_LIST.cacheTime;
        const dataAPI = await module.exports.fetchRaw(parsedOptions);
        const data = new List(dataAPI.guilds.slice(), { requestTimestamp: now, timestamp: dataAPI.request.timestamp * 1000 + timeDisparity });
        return data;
    } catch (e) {
        throwErr(e);
    }
};

/**
 * Fetches the the territory list from the API
 * @param {import("./util").RequestOptions} [options] The options for the request
 * @returns {Promise<List<Territory>>}
 */
module.exports.fetchTerritoryList = async function (options) {
    try {
        const now = Date.now();
        const parsedOptions = parseBaseRequestOptions(options);
        parsedOptions.route = config.routes.TERRITORY_LIST.url;
        parsedOptions.routeVersion = config.routes.TERRITORY_LIST.version;
        parsedOptions.cacheFor ??= config.routes.TERRITORY_LIST.cacheTime;
        const dataAPI = await module.exports.fetchRaw(parsedOptions);
        const data = new List(Object.values(dataAPI.territories)
            .map(v => new Territory(v))
            .sort((a, b) => a.territory > b.territory ? 1 : a.territory < b.territory ? -1 : 0),
            { requestTimestamp: now, timestamp: dataAPI.request.timestamp * 1000 + timeDisparity });
        data.list.forEach((v, i, a) => {
            v.connections = a.filter(v1 => v.connections.includes(v1.territory));
        });
        return data;
    } catch (e) {
        throwErr(e);
    }
};

/**
 * Fetches the online players from the API
 * @param {import("./util").RequestOptions} [options] The options for the request
 * @returns {Promise<List<World>>}
 */
module.exports.fetchOnlinePlayers = async function (options) {
    try {
        const now = Date.now();
        const parsedOptions = parseBaseRequestOptions(options);
        parsedOptions.route = config.routes.ONLINE_PLAYERS.url;
        parsedOptions.routeVersion = config.routes.ONLINE_PLAYERS.version;
        parsedOptions.cacheFor ??= config.routes.ONLINE_PLAYERS.cacheTime;
        const dataAPI = await module.exports.fetchRaw(parsedOptions);
        const data = new List(Object.entries(dataAPI)
            .filter(v => v[0] !== "request")
            .map(v => new World(v)),
            { requestTimestamp: now, timestamp: dataAPI.request.timestamp * 1000 + timeDisparity });
        return data;
    } catch (e) {
        throwErr(e);
    }
};

/**
 * Fetches the number of online players from the API
 * @param {import("./util").RequestOptions} [options] The options for the request
 * @returns {Promise<OnlinePlayersSum>}
 */
module.exports.fetchOnlinePlayersSum = async function (options) {
    try {
        const now = Date.now();
        const parsedOptions = parseBaseRequestOptions(options);
        parsedOptions.route = config.routes.ONLINE_PLAYERS_SUM.url;
        parsedOptions.routeVersion = config.routes.ONLINE_PLAYERS_SUM.version;
        parsedOptions.cacheFor ??= config.routes.ONLINE_PLAYERS_SUM.cacheTime;
        const dataAPI = await module.exports.fetchRaw(parsedOptions);
        const data = new OnlinePlayersSum(dataAPI, { requestTimestamp: now, timeDisparity: timeDisparity });
        return data;
    } catch (e) {
        throwErr(e);
    }
};

/**
 * Fetches all recipe names from the API
 * @param {import("./util").RequestOptions} [options] The options for the request
 * @returns {Promise<List<string>>}
 */
module.exports.fetchRecipeList = async function (options) {
    try {
        const now = Date.now();
        const parsedOptions = parseBaseRequestOptions(options);
        parsedOptions.route = config.routes.RECIPE_LIST.url;
        parsedOptions.routeVersion = config.routes.RECIPE_LIST.version;
        parsedOptions.cacheFor ??= config.routes.RECIPE_LIST.cacheTime;
        const dataAPI = await module.exports.fetchRaw(parsedOptions);
        const data = new List(dataAPI.data.slice(), { requestTimestamp: now, timestamp: dataAPI.timestamp + timeDisparity });
        return data;
    } catch (e) {
        throwErr(e);
    }
};

/**
 * Fetches all ingredient names from the API
 * @param {import("./util").RequestOptions} [options] The options for the request
 * @returns {Promise<List<string>>}
 */
module.exports.fetchIngredientList = async function (options) {
    try {
        const now = Date.now();
        const parsedOptions = parseBaseRequestOptions(options);
        parsedOptions.route = config.routes.INGREDIENT_LIST.url;
        parsedOptions.routeVersion = config.routes.INGREDIENT_LIST.version;
        parsedOptions.cacheFor ??= config.routes.INGREDIENT_LIST.cacheTime;
        const dataAPI = await module.exports.fetchRaw(parsedOptions);
        const data = new List(dataAPI.data.slice(), { requestTimestamp: now, timestamp: dataAPI.timestamp + timeDisparity });
        return data;
    } catch (e) {
        throwErr(e);
    }
};

/**
 * Fetches all recipes matching the options from the API. This function relies
 * on caching as it needs to request all recipes since most filters aren't
 * available on the Wynncraft API. Removing caching for this function or
 * passing low cache times does not cause failure, however it will cause
 * multiple MB of network traffic on every request.
 * @param {import("./util").RecipeSearchRequestOptions|string} [options] The options for the request, or a recipe ID
 * @returns {Promise<List<Recipe>>}
 */
module.exports.fetchRecipes = async function (options) {
    try {
        const now = Date.now();
        const parsedOptions = parseRecipeRequestOptions(options);
        if (parsedOptions.hasConflict)
            return new List([], { requestTimestamp: now, timestamp: now });
        parsedOptions.route = config.routes.RECIPE_SEARCH.url
        parsedOptions.routeVersion = config.routes.RECIPE_SEARCH.version;
        parsedOptions.cacheFor ??= config.routes.RECIPE_SEARCH.cacheTime;
        const dataAPI = await module.exports.fetchRaw(parsedOptions);
        const arr = dataAPI.data.map(v => new Recipe(v));
        if (parsedOptions.id)
            sweepArr(arr, v => v.id !== parsedOptions.id);
        if (parsedOptions.level)
            sweepArr(arr, v => v.level.max < parsedOptions.level.min || v.level.min > parsedOptions.level.max);
        if (parsedOptions.type)
            sweepArr(arr, v => v.type !== parsedOptions.type);
        if (parsedOptions.skill)
            sweepArr(arr, v => v.skill !== parsedOptions.skill);
        if (parsedOptions.health)
            sweepArr(arr, v => !v.health || v.health.max < parsedOptions.health.min || v.health.min > parsedOptions.health.max);
        if (parsedOptions.damage)
            sweepArr(arr, v => !v.damage || v.damage.max < parsedOptions.damage.min || v.damage.min > parsedOptions.damage.max);
        if (parsedOptions.durability)
            sweepArr(arr, v => !v.durability || v.durability.max < parsedOptions.durability.min || v.durability.min > parsedOptions.durability.max);
        if (parsedOptions.duration)
            sweepArr(arr, v => !v.duration || v.duration.max < parsedOptions.duration.min || v.duration.min > parsedOptions.duration.max);
        if (parsedOptions.basicDuration)
            sweepArr(arr, v => !v.basicDuration || v.basicDuration.max < parsedOptions.basicDuration.min || v.basicDuration.min > parsedOptions.basicDuration.max);
        const data = new List(arr, { requestTimestamp: now, timestamp: dataAPI.timestamp + timeDisparity });
        return data;
    } catch (e) {
        throwErr(e);
    }
};

/**
 * Fetches all ingredients matching the options from the API. This function
 * relies on caching as it needs to request all ingredients since most
 * filters aren't available on the Wynncraft API. Removing caching for this
 * function or passing low cache times does not cause failure, however it
 * will cause multiple MB of network traffic on every request.
 * @param {import("./util").IngredientSearchRequestOptions|string} [options] The options for the request, or the `displayName` of an ingredient
 * @returns {Promise<List<Ingredient>>}
 */
module.exports.fetchIngredients = async function (options) {
    try {
        const now = Date.now();
        const parsedOptions = parseIngredientRequestOptions(options);
        // commented out as no semantics checks can be done in ingredient request parser
        // if (parsedOptions.hasConflict)
        //     return new List([], { requestTimestamp: now, timestamp: now });
        parsedOptions.route = config.routes.INGREDIENT_SEARCH.url;
        parsedOptions.routeVersion = config.routes.INGREDIENT_SEARCH.version;
        parsedOptions.cacheFor ??= config.routes.INGREDIENT_SEARCH.cacheTime;
        const dataAPI = await module.exports.fetchRaw(parsedOptions);
        const arr = dataAPI.data.map(v => new Ingredient(v));
        if (parsedOptions.name)
            sweepArr(arr, v => !v.name.toUpperCase().includes(parsedOptions.name));
        if (parsedOptions.displayName)
            sweepArr(arr, v => !v.displayName.toUpperCase().includes(parsedOptions.displayName));
        if (parsedOptions.tier)
            sweepArr(arr, v => v.tier < parsedOptions.tier.min || v.tier > parsedOptions.tier.max);
        if (parsedOptions.level)
            sweepArr(arr, v => v.level < parsedOptions.level.min || v.level > parsedOptions.level.max);
        if (parsedOptions.sprite)
            sweepArr(arr, v => v.sprite.numericalId !== parsedOptions.sprite.id || (v.sprite.damage !== parsedOptions.sprite.damage && parsedOptions.sprite.damage));
        if (parsedOptions.skills) {
            if (parsedOptions.skills.requireAll) {
                sweepArr(arr, v => parsedOptions.skills.list.some(v1 => !v.skills.includes(v1)));
            } else {
                sweepArr(arr, v => parsedOptions.skills.list.every(v1 => !v.skills.includes(v1)));
            }
        }
        if (parsedOptions.identifications) {
            if (parsedOptions.identifications.requireAll) {
                sweepArr(arr, v => parsedOptions.identifications.list.some(v1 => !v1(v)));
            } else {
                sweepArr(arr, v => parsedOptions.identifications.list.every(v1 => !v1(v)));
            }
        }
        if (parsedOptions.restrictedIds) {
            if (parsedOptions.restrictedIds.requireAll) {
                sweepArr(arr, v => parsedOptions.restrictedIds.list.some(v1 => !v1(v)));
            } else {
                sweepArr(arr, v => parsedOptions.restrictedIds.list.every(v1 => !v1(v)));
            }
        }
        if (parsedOptions.positionModifiers) {
            if (parsedOptions.positionModifiers.requireAll) {
                sweepArr(arr, v => parsedOptions.positionModifiers.list.some(v1 => !v1(v)));
            } else {
                sweepArr(arr, v => parsedOptions.positionModifiers.list.every(v1 => !v1(v)));
            }
        }
        const data = new List(arr, { requestTimestamp: now, timestamp: dataAPI.timestamp + timeDisparity });
        return data;
    } catch (e) {
        throwErr(e);
    }
}

/**
 * Fetches all items matching the options from the API. This function relies on
 * caching as it needs to request all items since most filters aren't
 * available on the Wynncraft API. Removing caching for this function or
 * passing low cache times does not cause failure, however it will cause
 * multiple MB of network traffic on every request.
 * @param {import("./util").ItemSearchRequestOptions|string} [options] The options for the request, or the `displayName` of an item
 * @returns {Promise<List<Item>>}
 */
module.exports.fetchItems = async function (options) {
    try {
        const now = Date.now();
        const parsedOptions = parseItemRequestOptions(options);
        if (parsedOptions.hasConflict)
            return new List([], { requestTimestamp: now, timestamp: now });
        parsedOptions.route = config.routes.ITEM_SEARCH.url;
        parsedOptions.routeVersion = config.routes.ITEM_SEARCH.version;
        parsedOptions.cacheFor ??= config.routes.ITEM_SEARCH.cacheTime;
        const [dataAPI, dataAthena] = await Promise.all([
            module.exports.fetchRaw(parsedOptions),
            module.exports.fetchRaw({
                route: config.routes.ATHENA_ITEMS.url,
                allowCache: true,
                priority: parsedOptions.priority,
                retries: parsedOptions.retries,
                timeout: parsedOptions.timeout,
                cacheFor: config.routes.ATHENA_ITEMS.cacheTime,
                ignoreVersion: true
            })
        ]);
        for (const mId in dataAthena.majorIdentifications) {
            if (dataAthena.majorIdentifications.hasOwnProperty(mId)) {
                const majorIdGlobal = majorIds.find(v => v.apiName === mId);
                const majorIdExport = module.exports.data.majorIds.find(v => v.apiName === mId);
                if (majorIdGlobal) {
                    majorIdGlobal.inGameName = dataAthena.majorIdentifications[mId].name;
                    majorIdGlobal.description = dataAthena.majorIdentifications[mId].description;
                } else {
                    majorIds.push({
                        name: mId,
                        apiName: mId,
                        inGameName: dataAthena.majorIdentifications[mId].name,
                        description: dataAthena.majorIdentifications[mId].description
                    });
                }
                if (majorIdExport) {
                    majorIdExport.inGameName = dataAthena.majorIdentifications[mId].name;
                    majorIdExport.description = dataAthena.majorIdentifications[mId].description;
                } else {
                    module.exports.data.majorIds.push({
                        name: mId,
                        apiName: mId,
                        inGameName: dataAthena.majorIdentifications[mId].name,
                        description: dataAthena.majorIdentifications[mId].description
                    });
                }
            }
        }
        const arr = dataAPI.items.map(v => new Item(v));
        if (parsedOptions.name)
            sweepArr(arr, v => !v.name.toUpperCase().includes(parsedOptions.name));
        if (parsedOptions.displayName)
            sweepArr(arr, v => !v.displayName.toUpperCase().includes(parsedOptions.displayName));
        if (parsedOptions.type)
            sweepArr(arr, v => v.type !== parsedOptions.type);
        if (parsedOptions.tier)
            sweepArr(arr, v => v.tier !== parsedOptions.tier);
        if (parsedOptions.category)
            sweepArr(arr, v => v.category !== parsedOptions.category);
        if (parsedOptions.set !== undefined)
            sweepArr(arr, v => v.set !== parsedOptions.set);
        if (parsedOptions.sprite)
            sweepArr(arr, v => v.sprite.numericalId !== parsedOptions.sprite.id || (v.sprite.damage !== parsedOptions.sprite.damage && parsedOptions.sprite.damage));
        if (parsedOptions.color)
            sweepArr(arr, v => !v.color || v.color[0] !== parsedOptions.color[0] || v.color[1] !== parsedOptions.color[1] || v.color[2] !== parsedOptions.color[2]);
        if (parsedOptions.dropType)
            sweepArr(arr, v => v.dropType !== parsedOptions.dropType);
        if (parsedOptions.lore !== undefined)
            sweepArr(arr, v => (parsedOptions.lore ? !v.lore.toUpperCase().includes(parsedOptions.lore) : v.lore !== ""));
        if (parsedOptions.restriction !== undefined)
            sweepArr(arr, v => v.restriction !== parsedOptions.restriction);
        if (parsedOptions.requirements) {
            if (parsedOptions.requirements.requireAll) {
                sweepArr(arr, v => parsedOptions.requirements.list.some(v1 => !v1(v)));
            } else {
                sweepArr(arr, v => parsedOptions.requirements.list.every(v1 => !v1(v)));
            }
        }
        if (parsedOptions.identifications) {
            if (parsedOptions.identifications.requireAll) {
                sweepArr(arr, v => parsedOptions.identifications.list.some(v1 => !v1(v)));
            } else {
                sweepArr(arr, v => parsedOptions.identifications.list.every(v1 => !v1(v)));
            }
        }
        if (parsedOptions.stats) {
            if (parsedOptions.stats.requireAll) {
                sweepArr(arr, v => parsedOptions.stats.list.some(v1 => !v1(v)));
            } else {
                sweepArr(arr, v => parsedOptions.stats.list.every(v1 => !v1(v)));
            }
        }
        if (parsedOptions.majorIds) {
            if (parsedOptions.majorIds.requireAll) {
                sweepArr(arr, v => parsedOptions.majorIds.list.some(v1 => !v.majorIds.includes(v1)));
            } else {
                sweepArr(arr, v => parsedOptions.majorIds.list.every(v1 => !v.majorIds.includes(v1)));
            }
        }
        const data = new List(arr, { requestTimestamp: now, timestamp: dataAPI.request.timestamp * 1000 + timeDisparity });
        return data;
    } catch (e) {
        throwErr(e);
    }
}

// Backloaded dependencies to allow for circular dependencies
const Player = require("./models/Player");
const Guild = require("./models/Guild");
const List = require("./models/List");
const Territory = require("./models/Territory");
const World = require("./models/World");
const OnlinePlayersSum = require("./models/OnlinePlayersSum");
const LeaderboardPlayer = require("./models/LeaderboardPlayer");
const LeaderboardGuild = require("./models/LeaderboardGuild");
const Recipe = require("./models/Recipe");
const Ingredient = require("./models/Ingredient");
const Item = require("./models/Item");

// desync time to account for local system time drifting appart from the wynn API
let lastTimeSync = 0;
let timeDisparity = 0;
