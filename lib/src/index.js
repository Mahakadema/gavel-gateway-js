
// Here because config.js has a circular dependency to this
module.exports.flushCache = function () {
    const size = cache.size;
    cache.clear();
    return size;
}

const WynncraftAPIError = require("./WynncraftAPIError.js");
const SmartMap = require("./SmartMap.js");
const {
    parseBaseRequestOptions,
    parseRawRequestOptions,
    parsePlayerLeaderboardRequestOptions,
    parsePlayerRequestOptions,
    parsePlayerUUIDRequestOptions,
    parseGuildRequestOptions,
    parseNameRequestOptions,
    parseRecipeRequestOptions,
    parseIngredientRequestOptions,
    parseItemRequestOptions,
    semVerFromDecimal,
    sanitizeURL,
    sleep,
    requestJsonApi,
    interpretApiContent
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

// Mutable localdata var, the data used internally doesn't get changed by this
module.exports.data = {
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

    // remove old requests from ratelimit manager
    while (!ratelimits.GLOBAL.recent.isEmpty() && ratelimits.GLOBAL.recent.first() + 4000 < now)
        ratelimits.GLOBAL.recent.shift();

    // clear out old cache entries
    if (doCleanUp)
        cache.sweep(v => v.timestamp + v.cacheFor < now);
}

// Returns info on the ratelimit channels
module.exports.ratelimit = function () {
    const now = Date.now();

    // remove old requests from ratelimit manager
    while (!ratelimits.GLOBAL.recent.isEmpty() && ratelimits.GLOBAL.recent.first() + 4000 < now)
        ratelimits.GLOBAL.recent.shift();

    const channels = [];
    if (config.apiKeys.length > 0) {
        for (const key of config.apiKeys) {
            channels.push({
                apiKey: key.key,
                total: ratelimits[key.key].limit,
                remaining: ratelimits[key.key].remaining,
                reset: Math.max(0, ratelimits[key.key].reset - now),
                interval: ratelimits[key.key].interval,
                queued: ratelimits[key.key].queue.length + ratelimits[key.key].priorityQueue.length
            });
        }
    } else {
        channels.push({
            apiKey: null,
            total: ratelimits.DEFAULT.limit,
            remaining: ratelimits.DEFAULT.remaining,
            reset: Math.max(0, ratelimits.DEFAULT.reset - now),
            interval: ratelimits.DEFAULT.interval,
            queued: ratelimits.DEFAULT.queue.length + ratelimits.DEFAULT.priorityQueue.length
        });
    }

    return {
        apiKeys: config.apiKeys.length,
        channels: channels,
        totalOngoing: ratelimits.GLOBAL.ongoingRequestsAmount,
        totalQueued: ratelimits.GLOBAL.queuedAmount,
        recentRequestCount: ratelimits.GLOBAL.recent.length
    };
};

// set config and return copy thereof
module.exports.setConfig = configMod.set;

// Returns raw JSON of an api request
module.exports.fetchRaw = function (options) {
    const now = Date.now();

    housekeeping();

    // parse options
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
        ratelimitsToChooseFrom.sort((a, b) => b.remaining - a.remaining);
    } else { // select default (no key)
        ratelimitsToChooseFrom.push(ratelimits.DEFAULT);
    }
    const chosenRatelimit = ratelimitsToChooseFrom[0];

    // queue request if above ratelimit
    let queued = false;
    if (chosenRatelimit.remaining <= 0 || ratelimits.GLOBAL.ongoingRequestsAmount >= 50 || (ratelimits.GLOBAL.recent.length >= 90 && false)) { // ISPs often block incoming requests if they reach a high amount per second, throttle to prevent that
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
            // keep in queue until request can be processed
            let keepGoing = true;
            while (keepGoing) {
                // keep looping if any condition passes
                keepGoing = false;

                // delay request until ratelimit is expired
                if (chosenRatelimit.remaining <= 0) {
                    keepGoing = true;
                    await sleep(500);
                    if (chosenRatelimit.reset < Date.now()) {
                        chosenRatelimit.remaining = chosenRatelimit.limit;
                        chosenRatelimit.reset += chosenRatelimit.interval;
                    }
                    continue;
                }
                // delay request while too many requests where cast recently
                if (ratelimits.GLOBAL.recent.length >= 90) {
                    keepGoing = true;
                    await sleep(500);
                    while (!ratelimits.GLOBAL.recent.isEmpty() && ratelimits.GLOBAL.recent.first() + 4000 < Date.now())
                        ratelimits.GLOBAL.recent.shift();
                    continue;
                }
                // delay request while ongoing requests are too high
                if (ratelimits.GLOBAL.ongoingRequestsAmount >= 50) {
                    keepGoing = true;
                    await sleep(200);
                    continue;
                }
                // delay request in long increments until ratelimit expired, then do fast increments
                if (request.priority) {
                    if (chosenRatelimit.priorityQueue[0].id !== request.id) {
                        keepGoing = true;
                        await sleep(10);
                        continue;
                    }
                } else {
                    if (chosenRatelimit.priorityQueue.length > 0 || chosenRatelimit.queue[0].id !== request.id) {
                        keepGoing = true;
                        await sleep(10);
                        continue;
                    }
                }
            }
            // dequeue
            if (request.priority) {
                chosenRatelimit.priorityQueue.splice(chosenRatelimit.priorityQueue.findIndex(v => v.id === request.id), 1);
            } else {
                chosenRatelimit.queue.splice(chosenRatelimit.queue.findIndex(v => v.id === request.id), 1);
            }
            ratelimits.GLOBAL.queuedAmount--;
        }

        // mark request as ongoing
        ongoingRequests.set(request.route, request);
        ratelimits.GLOBAL.recent.append(Date.now());
        ratelimits.GLOBAL.ongoingRequestsAmount++;
        chosenRatelimit.ongoingRequestsAmount++;
        if (chosenRatelimit.remaining > 0)
            chosenRatelimit.remaining--;

        // fetch data
        let error = null;
        const data = await requestJsonApi(request.route, chosenRatelimit.value, parsedOptions.retries + 1, parsedOptions.timeout).catch(e => {
            error = e;
        });

        ongoingRequests.delete(request.route);
        ratelimits.GLOBAL.ongoingRequestsAmount--;
        chosenRatelimit.ongoingRequestsAmount--;

        if (error)
            throw error;

        // update ratelimit
        const responseTimestamp = Number.isNaN(Date.parse(data.headers["date"])) ? Date.now() : Date.parse(data.headers["date"]);
        if (data.headers["ratelimit-limit"]) {
            const oldRemaining = chosenRatelimit.remaining;
            chosenRatelimit.remaining = Math.max(0, Math.min(chosenRatelimit.remaining, Number(data.headers["ratelimit-remaining"]) - chosenRatelimit.ongoingRequestsAmount));
            if (chosenRatelimit.remaining !== oldRemaining)
                chosenRatelimit.reset = responseTimestamp + Number(data.headers["ratelimit-reset"]) * 1000;
        }

        /**
         * interpret data + sanity check ratelimit
         */

        // parse content and inject Date header into body
        let content = null;
        if (data.isJson) {
            if (data.body.request)
                data.body.request.currentTimestamp = responseTimestamp;
            else if (data.body.timestamp)
                data.body.currentTimestamp = responseTimestamp;
            content = data.body;
        } else {
            content = JSON.parse(data.body);
            if (content?.request)
                content.request.currentTimestamp = responseTimestamp;
            else if (content?.timestamp)
                content.currentTimestamp = responseTimestamp;
            data.body = JSON.stringify(content);
        }

        // API requests hit Ratelimit; instead of throwing, correct the incorrect remaining count and requeue the request
        if (content.message === "API rate limit exceeded") {
            chosenRatelimit.remaining = 0;
            if (parsedOptions.interpret) {
                if (config.throwOnRatelimitError)
                    throw new WynncraftAPIError(content.message);
                return await module.exports.fetchRaw(parsedOptions);
            }
        }

        if (parsedOptions.interpret) {
            content = interpretApiContent(content, data, parsedOptions);
        }

        // cache result
        if (config.reuseJson === data.isJson) { // only cache if config didn't just change (to avoid edge case bugs)
            let ts = Number.NaN;
            if (content)
                ts = (content.timestamp ?? (content.request?.timestamp * 1000)) - responseTimestamp + Date.now();
            if (Number.isNaN(ts))
                ts = Date.now();
            cache.set(parsedOptions.route, {
                timestamp: ts,
                cacheFor: parsedOptions.cacheFor,
                raw: content ? data.body : content
            });
        }

        return content;
    })();

    return request.data;
};

// Fetches the guild leaderboard
module.exports.fetchGuildLeaderboard = async function (options) {
    const now = Date.now();
    const parsedOptions = parseBaseRequestOptions(options);
    parsedOptions.route = config.routes.GUILD_LEADERBOARD.url;
    parsedOptions.routeVersion = config.routes.GUILD_LEADERBOARD.version;
    parsedOptions.cacheFor ??= config.routes.GUILD_LEADERBOARD.cacheTime;
    const dataAPI = await module.exports.fetchRaw(parsedOptions);
    const data = new List(dataAPI.data.map(v => new LeaderboardGuild(v)), { requestTimestamp: now, responseTimestamp: dataAPI.request.currentTimestamp, timestamp: dataAPI.request.timestamp * 1000, apiVersion: semVerFromDecimal(dataAPI.request.version), libVersion: "1.0.0", source: parsedOptions.route });
    return data;
};

// Fetches the player leaderboard
module.exports.fetchPlayerLeaderboard = async function (options) {
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
    const data = new List(arr, { requestTimestamp: now, responseTimestamp: dataAPI.currentTimestamp ?? dataAPI.request.currentTimestamp, timestamp: parsedOptions.apiVersion === "legacy" ? dataAPI.request.timestamp * 1000 : dataAPI.timestamp, apiVersion: parsedOptions.apiVersion === "legacy" ? semVerFromDecimal(dataAPI.request.version) : dataAPI.version, libVersion: dataAPI.data[0].character ? "2.0.0" : "1.0.0", source: parsedOptions.route });
    return data;
};

// Fetches a player
module.exports.fetchPlayer = async function (options) {
    const now = Date.now();
    const parsedOptions = parsePlayerRequestOptions(options);
    parsedOptions.route = sanitizeURL(config.routes.PLAYER.url.replace("%v", parsedOptions.player));
    parsedOptions.routeVersion = config.routes.PLAYER.version;
    parsedOptions.cacheFor ??= config.routes.PLAYER.cacheTime;
    const dataAPI = await module.exports.fetchRaw(parsedOptions)
        .then(async v0 => {
            if (!v0 || /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(parsedOptions.player) || (parsedOptions.forceCaseMatch ? v0.data[0].username === parsedOptions.player : v0.data[0].username.toLowerCase() === parsedOptions.player.toLowerCase()))
                return v0;
            // search the players name to correct capitalization (if needed)
            let correctName = null;
            if (!parsedOptions.forceCaseMatch) {
                const searchResult = await module.exports.fetchNames(parsedOptions.player);
                correctName = searchResult.players.find(v => v === parsedOptions.player) ?? searchResult.players.find(v => v.toLowerCase() === parsedOptions.player.toLowerCase());
            }
            // fetch UUID, if no correct spelling was found (name API is weird) use the provided spelling
            const uuid = await module.exports.fetchPlayerUUID(correctName ?? parsedOptions.player);
            if (!uuid)
                return uuid;
            parsedOptions.route = sanitizeURL(config.routes.PLAYER.url.replace("%v", uuid.uuid));
            return await module.exports.fetchRaw(parsedOptions);
        });
    const data = dataAPI === null ? null : new Player(dataAPI, { requestTimestamp: now, source: parsedOptions.route });
    return data;
};

// Fetches a player UUID
module.exports.fetchPlayerUUID = async function (options) {
    const now = Date.now();
    const parsedOptions = parsePlayerUUIDRequestOptions(options);
    parsedOptions.route = sanitizeURL(config.routes.PLAYER_UUID.url.replace("%v", parsedOptions.player));
    parsedOptions.routeVersion = config.routes.PLAYER_UUID.version;
    parsedOptions.cacheFor ??= config.routes.PLAYER_UUID.cacheTime;
    const dataAPI = await module.exports.fetchRaw(parsedOptions);
    const data = dataAPI === null ? null : new UUID(dataAPI, { requestTimestamp: now, source: parsedOptions.route });
    return data;
}

// Fetches a guild
module.exports.fetchGuild = async function (options) {
    const now = Date.now();
    const parsedOptions = parseGuildRequestOptions(options);
    parsedOptions.route = sanitizeURL(config.routes.GUILD.url.replace("%v", parsedOptions.guild));
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
        fetchAdditionalStats: parsedOptions.fetchAdditionalStats,
        onlinePlayers: onlinePlayers,
        territories: territories,
        source: parsedOptions.route
    });
    return data;
};

// Fetches all guild names
module.exports.fetchGuildList = async function (options) {
    const now = Date.now();
    const parsedOptions = parseBaseRequestOptions(options);
    parsedOptions.route = config.routes.GUILD_LIST.url;
    parsedOptions.routeVersion = config.routes.GUILD_LIST.version;
    parsedOptions.cacheFor ??= config.routes.GUILD_LIST.cacheTime;
    const dataAPI = await module.exports.fetchRaw(parsedOptions);
    const data = new List(dataAPI.guilds.slice(), { requestTimestamp: now, responseTimestamp: dataAPI.request.currentTimestamp, timestamp: dataAPI.request.timestamp * 1000, apiVersion: semVerFromDecimal(dataAPI.request.version), libVersion: "1.0.0", source: parsedOptions.route });
    return data;
};

// Fetches the territory list
module.exports.fetchTerritoryList = async function (options) {
    const now = Date.now();
    const parsedOptions = parseBaseRequestOptions(options);
    parsedOptions.route = config.routes.TERRITORY_LIST.url;
    parsedOptions.routeVersion = config.routes.TERRITORY_LIST.version;
    parsedOptions.cacheFor ??= config.routes.TERRITORY_LIST.cacheTime;
    const dataAPI = await module.exports.fetchRaw(parsedOptions);
    const data = new List(Object.values(dataAPI.territories)
        .map(v => new Territory(v))
        .sort((a, b) => a.territory > b.territory ? 1 : a.territory < b.territory ? -1 : 0),
        { requestTimestamp: now, responseTimestamp: dataAPI.request.currentTimestamp, timestamp: dataAPI.request.timestamp * 1000, apiVersion: semVerFromDecimal(dataAPI.request.version), libVersion: "1.0.0", source: parsedOptions.route });
    data.list.forEach((v, _, a) => {
        v.connections = a.filter(v1 => v.connections.includes(v1.territory));
    });
    return data;
};

// Fetches the map locations
module.exports.fetchMapLocations = async function (options) {
    const now = Date.now();
    const parsedOptions = parseBaseRequestOptions(options);
    parsedOptions.route = config.routes.MAP_LOCATIONS.url;
    parsedOptions.ignoreVersion = true;
    parsedOptions.cacheFor ??= config.routes.MAP_LOCATIONS.cacheTime;
    const dataAPI = await module.exports.fetchRaw(parsedOptions);
    const data = new List(dataAPI.locations
        .filter(v => v.name !== "~~~~~~~~~")
        .map(v => new MapLocation(v)),
        { requestTimestamp: now, responseTimestamp: dataAPI.request.currentTimestamp, timestamp: dataAPI.request.timestamp * 1000, apiVersion: semVerFromDecimal(1), libVersion: "1.0.0", source: parsedOptions.route });
    return data;
}

// Fetches the world list
module.exports.fetchOnlinePlayers = async function (options) {
    const now = Date.now();
    const parsedOptions = parseBaseRequestOptions(options);
    parsedOptions.route = config.routes.ONLINE_PLAYERS.url;
    parsedOptions.routeVersion = config.routes.ONLINE_PLAYERS.version;
    parsedOptions.cacheFor ??= config.routes.ONLINE_PLAYERS.cacheTime;
    const dataAPI = await module.exports.fetchRaw(parsedOptions);
    const data = new List(Object.entries(dataAPI)
        .filter(v => v[0] !== "request")
        .map(v => new World(v)),
        { requestTimestamp: now, responseTimestamp: dataAPI.request.currentTimestamp, timestamp: dataAPI.request.timestamp * 1000, apiVersion: semVerFromDecimal(dataAPI.request.version), libVersion: "1.0.0", source: parsedOptions.route });
    return data;
};

// Fetches the online player sum
module.exports.fetchOnlinePlayersSum = async function (options) {
    const now = Date.now();
    const parsedOptions = parseBaseRequestOptions(options);
    parsedOptions.route = config.routes.ONLINE_PLAYERS_SUM.url;
    parsedOptions.routeVersion = config.routes.ONLINE_PLAYERS_SUM.version;
    parsedOptions.cacheFor ??= config.routes.ONLINE_PLAYERS_SUM.cacheTime;
    const dataAPI = await module.exports.fetchRaw(parsedOptions);
    const data = new OnlinePlayersSum(dataAPI, { requestTimestamp: now, source: parsedOptions.route });
    return data;
};

// Fetches a name query
module.exports.fetchNames = async function (options) {
    const now = Date.now();
    const parsedOptions = parseNameRequestOptions(options);
    parsedOptions.route = sanitizeURL(config.routes.NAME_SEARCH.url.replace("%v", parsedOptions.query));
    parsedOptions.routeVersion = config.routes.NAME_SEARCH.version;
    parsedOptions.cacheFor ??= config.routes.NAME_SEARCH.cacheTime;
    const dataAPI = await module.exports.fetchRaw(parsedOptions);
    const data = new NameSearch(dataAPI, { requestTimestamp: now, source: parsedOptions.route });
    return data;
};

// Fetches all recipe IDs
module.exports.fetchRecipeList = async function (options) {
    const now = Date.now();
    const parsedOptions = parseBaseRequestOptions(options);
    parsedOptions.route = config.routes.RECIPE_LIST.url;
    parsedOptions.routeVersion = config.routes.RECIPE_LIST.version;
    parsedOptions.cacheFor ??= config.routes.RECIPE_LIST.cacheTime;
    const dataAPI = await module.exports.fetchRaw(parsedOptions);
    const data = new List(dataAPI.data.slice(), { requestTimestamp: now, responseTimestamp: dataAPI.currentTimestamp, timestamp: dataAPI.timestamp, apiVersion: dataAPI.version, libVersion: "1.0.0", source: parsedOptions.route });
    return data;
};

// Fetches all ingredient names
module.exports.fetchIngredientList = async function (options) {
    const now = Date.now();
    const parsedOptions = parseBaseRequestOptions(options);
    parsedOptions.route = config.routes.INGREDIENT_LIST.url;
    parsedOptions.routeVersion = config.routes.INGREDIENT_LIST.version;
    parsedOptions.cacheFor ??= config.routes.INGREDIENT_LIST.cacheTime;
    const dataAPI = await module.exports.fetchRaw(parsedOptions);
    const data = new List(dataAPI.data.slice(), { requestTimestamp: now, responseTimestamp: dataAPI.currentTimestamp, timestamp: dataAPI.timestamp, apiVersion: dataAPI.version, libVersion: "1.0.0", source: parsedOptions.route });
    return data;
};

// fetches recipes
module.exports.fetchRecipes = async function (options) {
    const now = Date.now();
    const parsedOptions = parseRecipeRequestOptions(options);
    parsedOptions.route = config.routes.RECIPE_SEARCH.url
    parsedOptions.routeVersion = config.routes.RECIPE_SEARCH.version;
    parsedOptions.cacheFor ??= config.routes.RECIPE_SEARCH.cacheTime;
    if (parsedOptions.hasConflict)
        return new List([], { requestTimestamp: now, responseTimestamp: now, timestamp: now, apiVersion: parsedOptions.routeVersion, libVersion: "1.0.0", source: parsedOptions.route });
    const dataAPI = await module.exports.fetchRaw(parsedOptions);
    let arr = dataAPI.data.map(v => new Recipe(v));
    if (parsedOptions.id)
        arr = arr.filter(v => v.id === parsedOptions.id);
    if (parsedOptions.level)
        arr = arr.filter(v => !(v.level.max < parsedOptions.level.min || v.level.min > parsedOptions.level.max));
    if (parsedOptions.type)
        arr = arr.filter(v => v.type === parsedOptions.type);
    if (parsedOptions.skill)
        arr = arr.filter(v => v.skill === parsedOptions.skill);
    if (parsedOptions.health)
        arr = arr.filter(v => v.health && !(v.health.max < parsedOptions.health.min || v.health.min > parsedOptions.health.max));
    if (parsedOptions.damage)
        arr = arr.filter(v => v.damage && !(v.damage.max < parsedOptions.damage.min || v.damage.min > parsedOptions.damage.max));
    if (parsedOptions.durability)
        arr = arr.filter(v => v.durability && !(v.durability.max < parsedOptions.durability.min || v.durability.min > parsedOptions.durability.max));
    if (parsedOptions.duration)
        arr = arr.filter(v => v.duration && !(v.duration.max < parsedOptions.duration.min || v.duration.min > parsedOptions.duration.max));
    if (parsedOptions.basicDuration)
        arr = arr.filter(v => v.basicDuration && !(v.basicDuration.max < parsedOptions.basicDuration.min || v.basicDuration.min > parsedOptions.basicDuration.max));
    const data = new List(arr, { requestTimestamp: now, responseTimestamp: dataAPI.currentTimestamp, timestamp: dataAPI.timestamp, apiVersion: dataAPI.version, libVersion: "1.0.0", source: parsedOptions.route });
    return data;
};

// Fetches Ingredients
module.exports.fetchIngredients = async function (options) {
    const now = Date.now();
    const parsedOptions = parseIngredientRequestOptions(options);
    parsedOptions.route = config.routes.INGREDIENT_SEARCH.url;
    parsedOptions.routeVersion = config.routes.INGREDIENT_SEARCH.version;
    parsedOptions.cacheFor ??= config.routes.INGREDIENT_SEARCH.cacheTime;
    // commented out as no semantics checks can be done in ingredient request parser
    // if (parsedOptions.hasConflict)
    //     return new List([], { requestTimestamp: now, responseTimestamp: now, timestamp: now, apiVersion: parsedOptions.routeVersion, libVersion: "1.0.0", source: parsedOptions.route });
    const dataAPI = await module.exports.fetchRaw(parsedOptions);
    let arr = dataAPI.data.map(v => new Ingredient(v));
    if (parsedOptions.name)
        arr = arr.filter(v => v.name.toUpperCase().includes(parsedOptions.name));
    if (parsedOptions.displayName)
        arr = arr.filter(v => v.displayName.toUpperCase().includes(parsedOptions.displayName));
    if (parsedOptions.tier)
        arr = arr.filter(v => !(v.tier < parsedOptions.tier.min || v.tier > parsedOptions.tier.max));
    if (parsedOptions.level)
        arr = arr.filter(v => !(v.level < parsedOptions.level.min || v.level > parsedOptions.level.max));
    if (parsedOptions.sprite)
        arr = arr.filter(v => v.sprite.numericalId === parsedOptions.sprite.id && (v.sprite.damage === parsedOptions.sprite.damage || !parsedOptions.sprite.damage));
    if (parsedOptions.skills) {
        if (parsedOptions.skills.requireAll) {
            arr = arr.filter(v0 => parsedOptions.skills.list.every(v1 => v0.skills.includes(v1)));
        } else {
            arr = arr.filter(v0 => parsedOptions.skills.list.some(v1 => v0.skills.includes(v1)));
        }
    }
    if (parsedOptions.identifications) {
        if (parsedOptions.identifications.requireAll) {
            arr = arr.filter(v0 => parsedOptions.identifications.list.every(v1 => v1(v0)));
        } else {
            arr = arr.filter(v0 => parsedOptions.identifications.list.some(v1 => v1(v0)));
        }
    }
    if (parsedOptions.restrictedIds) {
        if (parsedOptions.restrictedIds.requireAll) {
            arr = arr.filter(v0 => parsedOptions.restrictedIds.list.every(v1 => v1(v0)));
        } else {
            arr = arr.filter(v0 => parsedOptions.restrictedIds.list.some(v1 => v1(v0)));
        }
    }
    if (parsedOptions.positionModifiers) {
        if (parsedOptions.positionModifiers.requireAll) {
            arr = arr.filter(v0 => parsedOptions.positionModifiers.list.every(v1 => v1(v0)));
        } else {
            arr = arr.filter(v0 => parsedOptions.positionModifiers.list.some(v1 => v1(v0)));
        }
    }
    const data = new List(arr, { requestTimestamp: now, responseTimestamp: dataAPI.currentTimestamp, timestamp: dataAPI.timestamp, apiVersion: dataAPI.version, libVersion: "1.0.0", source: parsedOptions.route });
    return data;
}

// Fetches items
module.exports.fetchItems = async function (options) {
    const now = Date.now();
    const parsedOptions = parseItemRequestOptions(options);
    parsedOptions.route = config.routes.ITEM_SEARCH.url;
    parsedOptions.routeVersion = config.routes.ITEM_SEARCH.version;
    parsedOptions.cacheFor ??= config.routes.ITEM_SEARCH.cacheTime;
    if (parsedOptions.hasConflict)
        return new List([], { requestTimestamp: now, responseTimestamp: now, timestamp: now, apiVersion: semVerFromDecimal(parsedOptions.routeVersion), libVersion: "1.0.0", source: parsedOptions.route });
    const [dataAPI, dataAthena] = await Promise.all([
        module.exports.fetchRaw(parsedOptions),
        module.exports.fetchRaw({
            route: config.routes.ATHENA_ITEMS.url,
            allowCache: true,
            priority: parsedOptions.priority,
            retries: parsedOptions.retries,
            timeout: parsedOptions.timeout,
            cacheFor: config.routes.ATHENA_ITEMS.cacheTime,
            ignoreVersion: true,
            interpret: false
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
    let arr = dataAPI.items.map(v => new Item(v));
    if (parsedOptions.name)
        arr = arr.filter(v => v.name.toUpperCase().includes(parsedOptions.name));
    if (parsedOptions.displayName)
        arr = arr.filter(v => v.displayName.toUpperCase().includes(parsedOptions.displayName));
    if (parsedOptions.type)
        arr = arr.filter(v => v.type === parsedOptions.type);
    if (parsedOptions.tier)
        arr = arr.filter(v => v.tier === parsedOptions.tier);
    if (parsedOptions.category)
        arr = arr.filter(v => v.category === parsedOptions.category);
    if (parsedOptions.set !== undefined)
        arr = arr.filter(v => v.set === parsedOptions.set);
    if (parsedOptions.sprite)
        arr = arr.filter(v => v.sprite.numericalId === parsedOptions.sprite.id && (v.sprite.damage === parsedOptions.sprite.damage || !parsedOptions.sprite.damage));
    if (parsedOptions.color)
        arr = arr.filter(v => v.color && v.color[0] === parsedOptions.color[0] && v.color[1] === parsedOptions.color[1] && v.color[2] === parsedOptions.color[2]);
    if (parsedOptions.dropType)
        arr = arr.filter(v => v.dropType === parsedOptions.dropType);
    if (parsedOptions.lore !== undefined)
        arr = arr.filter(v => (parsedOptions.lore ? v.lore.toUpperCase().includes(parsedOptions.lore) : v.lore === ""));
    if (parsedOptions.restriction !== undefined)
        arr = arr.filter(v => v.restriction === parsedOptions.restriction);
    if (parsedOptions.requirements) {
        if (parsedOptions.requirements.requireAll) {
            arr = arr.filter(v0 => parsedOptions.requirements.list.every(v1 => v1(v0)));
        } else {
            arr = arr.filter(v0 => parsedOptions.requirements.list.some(v1 => v1(v0)));
        }
    }
    if (parsedOptions.identifications) {
        if (parsedOptions.identifications.requireAll) {
            arr = arr.filter(v0 => parsedOptions.identifications.list.every(v1 => v1(v0)));
        } else {
            arr = arr.filter(v0 => parsedOptions.identifications.list.some(v1 => v1(v0)));
        }
    }
    if (parsedOptions.stats) {
        if (parsedOptions.stats.requireAll) {
            arr = arr.filter(v0 => parsedOptions.stats.list.every(v1 => v1(v0)));
        } else {
            arr = arr.filter(v0 => parsedOptions.stats.list.some(v1 => v1(v0)));
        }
    }
    if (parsedOptions.majorIds) {
        if (parsedOptions.majorIds.requireAll) {
            arr = arr.filter(v0 => parsedOptions.majorIds.list.every(v1 => v0.majorIds.includes(v1)));
        } else {
            arr = arr.filter(v0 => parsedOptions.majorIds.list.some(v1 => v0.majorIds.includes(v1)));
        }
    }
    const data = new List(arr, { requestTimestamp: now, responseTimestamp: dataAPI.request.currentTimestamp, timestamp: dataAPI.request.timestamp * 1000, apiVersion: semVerFromDecimal(dataAPI.request.version), libVersion: "1.0.0", source: parsedOptions.route });
    return data;
}

// Fetches self location
module.exports.fetchMyLocation = async function (options) {
    const now = Date.now();
    const parsedOptions = parseBaseRequestOptions(options);
    parsedOptions.route = config.routes.MY_LOCATION.url;
    parsedOptions.ignoreVersion = true;
    parsedOptions.cacheFor ??= config.routes.MY_LOCATION.cacheTime;
    try {
        const dataAPI = await module.exports.fetchRaw(parsedOptions);
        const data = new PlayerParty(dataAPI, { requestTimestamp: now, source: parsedOptions.route });
        return data;
    } catch (e) {
        if (e.message === "Bad request") // If IP is not logged in, return null
            return null;
        throw e;
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
const NameSearch = require("./models/NameSearch");
const MapLocation = require("./models/MapLocation");
const PlayerParty = require("./models/PlayerParty");
const UUID = require("./models/UUID");
