
// Here because config.js has a circular dependency to this
module.exports.flushCache = function () {
    const size = cache.size;
    cache.clear();
    return size;
}

const WynncraftAPIError = require("./WynncraftAPIError.js");
const MultipleChoicesError = require("./MultipleChoicesError.js");
const SmartMap = require("./SmartMap.js");

/**
 * Imports of Models at end of file to prevent circular dependency issues
 */

const minecraftIds = require("../data/minecraftIds.json");
const territories = require("../data/territories.json");
const sprites = require("../data/sprites.json");
const guildLevels = require("../data/guildLevels.json");
const guildLevelRewards = require("../data/guildLevelRewards.json");

const configMod = require("./config.js");

// Mutable localdata var, the data used internally doesn't get changed by this
module.exports.data = {
    minecraftIds: {
        strings: new Map(),
        nums: new Map()
    },
    territories: new Map(),
    sprites: new Map(),
    guildLevels: guildLevels.map(v => ({ ...v })),
    guildLevelRewards: guildLevelRewards.map(v => ({ ...v }))
};

for (const t of Object.getOwnPropertyNames(territories).filter(v => v !== "_default")) {
    const newT = { ...territories[t] };
    newT.resources = { ...newT.resources };
    newT.connections = newT.connections.slice();
    module.exports.data.territories.set(t, newT);
}

for (const s of Object.getOwnPropertyNames(sprites))
    module.exports.data.sprites.set(s, { ...sprites[s] });

for (const id of Object.getOwnPropertyNames(minecraftIds.strings))
    module.exports.data.minecraftIds.strings.set(id, minecraftIds.strings[id]);

for (const id of Object.getOwnPropertyNames(minecraftIds.nums))
    module.exports.data.minecraftIds.nums.set(id, minecraftIds.nums[id]);

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

const RELEVANT_PING_TIMEFRAME = 10000;
const RELEVANT_PING_POINT_AMOUNT = 25;

// housekeeping
function housekeeping() {
    const now = Date.now();

    let doCleanUp = false;

    // reset remaining requests if reset time was surpassed
    // TODO: also DEFAULT_LEGACY if becomes relevant again
    if (now > ratelimits.DEFAULT.reset) {
        ratelimits.DEFAULT.remaining = ratelimits.DEFAULT.limit;
        ratelimits.DEFAULT.reset += ratelimits.DEFAULT.interval;
        doCleanUp = true;
    }
    for (const key of config.apiKeys) {
        if (now > ratelimits[key.key].reset) {
            ratelimits[key.key].remaining = ratelimits[key.key].limit;
            ratelimits[key.key].reset += ratelimits[key.key].interval;
        }
    }

    // remove old requests from ratelimit manager
    while (!ratelimits.GLOBAL.recent.isEmpty() && ratelimits.GLOBAL.recent.first() + 4000 < now)
        ratelimits.GLOBAL.recent.shift();

    // clear out old cache entries
    if (doCleanUp)
        cache.sweep(v => !(v.timestamp + v.cacheFor >= now));

    // clear old ping measurements
    const firstRelevantIndex = pingTimes.findIndex((v, i, a) => v.time + RELEVANT_PING_TIMEFRAME >= now);
    pingTimes.splice(0, Math.max(pingTimes.length - RELEVANT_PING_POINT_AMOUNT, firstRelevantIndex === -1 ? pingTimes.length - 1 : firstRelevantIndex));
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
                apiVersions: ratelimits[key.key].apiVersions.slice(),
                total: ratelimits[key.key].limit,
                remaining: ratelimits[key.key].remaining,
                reset: Math.max(0, ratelimits[key.key].reset - now),
                interval: ratelimits[key.key].interval,
                queued: ratelimits[key.key].queue.length
            });
        }
    }
    // if (!channels.some(channel => ["legacy", "v2"].every(v => channel.apiVersions.includes(v)))) {
    //     channels.push({
    //         apiKey: null,
    //         apiVersions: ratelimits.DEFAULT_LEGACY.apiVersions.slice(),
    //         total: ratelimits.DEFAULT_LEGACY.limit,
    //         remaining: ratelimits.DEFAULT_LEGACY.remaining,
    //         reset: Math.max(0, ratelimits.DEFAULT_LEGACY.reset - now),
    //         interval: ratelimits.DEFAULT_LEGACY.interval,
    //         queued: ratelimits.DEFAULT_LEGACY.queue.length
    //     });
    // }
    if (!channels.some(channel => ["legacy", "v2", "v3"].every(v => channel.apiVersions.includes(v)))) {
        channels.push({
            apiKey: null,
            apiVersions: ratelimits.DEFAULT.apiVersions.slice(),
            total: ratelimits.DEFAULT.limit,
            remaining: ratelimits.DEFAULT.remaining,
            reset: Math.max(0, ratelimits.DEFAULT.reset - now),
            interval: ratelimits.DEFAULT.interval,
            queued: ratelimits.DEFAULT.queue.length
        });
    }

    const relevantPingTimes = pingTimes.filter((v, i, a) => a.length === i + 1 || v.time + RELEVANT_PING_TIMEFRAME >= Date.now()).slice(-RELEVANT_PING_POINT_AMOUNT);

    return {
        apiKeys: config.apiKeys.length,
        channels: channels,
        totalOngoing: ratelimits.GLOBAL.ongoingRequestsAmount,
        totalQueued: ratelimits.GLOBAL.queuedAmount,
        recentRequestCount: ratelimits.GLOBAL.recent.length,
        ping: Math.ceil(relevantPingTimes.reduce((p, c, _, a) => p + c.value / a.length, 0)),
    };
};

// set config and return copy thereof
module.exports.setConfig = configMod.set;

/**
 * req struct:
 * {
 *  id: number
 *  isOngoing: boolean
 *  promise: Promise<object | string>
 *  route: string,
 *  queuedAt: number,
 *  priority: boolean,
 *  reuseJson: boolean
 *  exitQueue: Function | null
 * }
 * 
 * cache entries:
 * {
 *  timestamp: number,
 *  cacheFor: number,
 *  raw: RawRequest
 * }
 */

// Always store object in cache, but on false request, reparse.
// And on first request, use the raw request body to not stringify unnecessarily.


// fetches the raw response from the API
module.exports.fetchRaw = function (options) {
    const now = Date.now();

    // TODO: check if better possible
    housekeeping();

    // parse options
    const parsedOptions = parseRawRequestOptions(options);

    // stack request if possible
    if (parsedOptions.allowCache) {
        // ongoing requests
        const req = ongoingRequests.get(parsedOptions.route);
        if (req)
            return (req.reuseJson && parsedOptions.reuseJson) ? req.promise : req.promise.then(v => JSON.parse(JSON.stringify(v)));

        // queued requests
        for (const key of Object.getOwnPropertyNames(ratelimits).filter(v => v !== "GLOBAL")) {
            const reqs = ratelimits[key].queue.values()
            const reqIndex = reqs.findIndex(v => v.route === parsedOptions.route);
            if (reqIndex === -1)
                continue;
            if (parsedOptions.priority && !reqs[reqIndex].priority) {
                ratelimits[key].queue.remove(reqIndex);
                ratelimits[key].queue.append(reqs[reqIndex], true);
                reqs[reqIndex].priority = true;
            }
            return (reqs[reqIndex].reuseJson && parsedOptions.reuseJson) ? reqs[reqIndex].promise : reqs[reqIndex].promise.then(v => JSON.parse(JSON.stringify(v)));
        }
    }

    // use cache if available
    if (parsedOptions.allowCache && parsedOptions.interpret) {
        const entry = cache.get(parsedOptions.route);
        if (entry && entry.timestamp + entry.cacheFor > now) {
            if (parsedOptions.reuseJson) {
                return Promise.resolve(entry.raw);
            } else {
                return Promise.resolve(JSON.parse(JSON.stringify(entry.raw)));
            }
        }
    }

    // select a ratelimit
    const ratelimitsToChooseFrom = [];
    if (parsedOptions.apiKey) { // forced API key given
        ratelimitsToChooseFrom.push(ratelimits[parsedOptions.apiKey]);
    } else if (config.apiKeys.length > 0 && ["legacy", "v2", "v3"].includes(parsedOptions.apiVersion)) { // select best option from available ones
        for (const { key } of config.apiKeys) {
            ratelimitsToChooseFrom.push(ratelimits[key]);
        }
        ratelimitsToChooseFrom.sort((a, b) => b.remaining - a.remaining);
    } else { // select default (no keys registered)
        if (["legacy", "v2", "v3"].includes(parsedOptions.apiVersion)) {
            ratelimitsToChooseFrom.push(ratelimits.DEFAULT);
        }
        // else if (["legacy", "v2"].includes(parsedOptions.apiVersion)) {
        //     ratelimitsToChooseFrom.push(ratelimits.DEFAULT_LEGACY);
        // }
    }
    const chosenRatelimit = ratelimitsToChooseFrom[0];
    // if (!chosenRatelimit)
    //     console.log("NO RATELIMIT MATCH");

    const request = {
        id: ++currentRequestId,
        route: parsedOptions.route,
        queuedAt: now,
        priority: parsedOptions.priority,
        reuseJson: parsedOptions.reuseJson,
        promise: undefined,
        isOngoing: false, // no use yet
        markOngoing: () => {
            request.isOngoing = true;
            ongoingRequests.set(request.route, request);
            ratelimits.GLOBAL.recent.append(Date.now());
            ratelimits.GLOBAL.ongoingRequestsAmount++;
            chosenRatelimit.ongoingRequestsAmount++;
            if (chosenRatelimit.remaining > 0)
                chosenRatelimit.remaining--;
        },
        // a function that will run time critical code and allow the request to run further, see the await below
        exitQueue: null
    };

    let queuePromise = null;
    if (chosenRatelimit.remaining <= 0 || ratelimits.GLOBAL.ongoingRequestsAmount >= 50 || ratelimits.GLOBAL.recent.length >= 90) { // ISPs often block incoming requests if they reach a high amount per second, throttle to prevent that
        if (ratelimits.GLOBAL.queuedAmount >= config.maxQueueLength) {
            return Promise.reject(new RangeError("Maximum queue length exceeded"));
        }
        chosenRatelimit.queue.append(request, parsedOptions.priority);
        ratelimits.GLOBAL.queuedAmount++;
        queuePromise = new Promise(res => request.exitQueue = () => {
            /**
             * This code is critical to run before any
             * other promises are resolved. As such,
             * this code cannot run after the "await"
             * of the promise resolved below
             */
            // mark request as ongoing
            request.markOngoing();

            // resolve queuePromise
            res();
        });
        emptyQueue(chosenRatelimit);
    }

    request.promise = new Promise(async (resolve, reject) => {
        if (queuePromise) {
            // request gets marked in the promise resolve function
            await queuePromise;
        } else {
            request.markOngoing();
        }

        // fetch data
        let data;
        try {
            data = await requestJsonApi(request.route, chosenRatelimit.value, parsedOptions.retries + 1, parsedOptions.timeout);
        } catch (e) {
            reject(e);
            return;
        } finally {
            ongoingRequests.delete(request.route);
            ratelimits.GLOBAL.ongoingRequestsAmount--;
            chosenRatelimit.ongoingRequestsAmount--;
        }

        // update ratelimit
        if (parsedOptions.apiVersion === "legacy" || parsedOptions.apiVersion === "v2" || parsedOptions.apiVersion === "v3") {
            if (data.headers["ratelimit-limit"]) {
                chosenRatelimit.remaining = Math.max(0, Math.min(chosenRatelimit.remaining, Number(data.headers["ratelimit-remaining"]) - chosenRatelimit.ongoingRequestsAmount));
                chosenRatelimit.reset = Math.min(chosenRatelimit.reset, Date.now() + Number(data.headers["ratelimit-reset"]) * 1000);
            }
        }

        // if API requests hit Ratelimit, instead of throwing, correct the incorrect remaining count and requeue the request
        if (data.status === 429) {
            chosenRatelimit.remaining = 0;
            if (parsedOptions.interpret) {
                if (config.throwOnRatelimitError) {
                    reject(new WynncraftAPIError("API rate limit exceeded"));
                    return;
                }
                // console.log("RATELIMIT hit")
                resolve(await module.exports.fetchRaw({ ...parsedOptions, priority: true }));
                return;
            }
        }

        const newCacheEntry = {
            requestedAt: data.requestTimestamp,
            respondedAt: data.responseTimestamp,
            receivedAt: data.receivedTimestamp,
            dataTimestamp: null,
            status: data.status,
            headers: data.headers,
            body: JSON.parse(data.body),
        };
        if (parsedOptions.interpret) {
            try {
                newCacheEntry.body = interpretApiContent(newCacheEntry.body, data, parsedOptions);
            } catch (e) {
                reject(e);
                return;
            }
        }

        if (parsedOptions.apiVersion === "legacy" && newCacheEntry.body?.request) {
            newCacheEntry.dataTimestamp = newCacheEntry.body.request.timestamp * 1000;
        } else if (parsedOptions.apiVersion === "v2" && newCacheEntry.body) {
            newCacheEntry.dataTimestamp = newCacheEntry.body.timestamp;
        } else if (parsedOptions.apiVersion === "v3") {
            // const cacheTime = Number(/^(?:.*, ?)?max-age=(?<seconds>\d+)$/.exec(data.headers["cache-control"]).groups.seconds) * 1000;
            const expires = new Date(newCacheEntry.headers["expires"]);
            const cacheTtl = Number(/max-age=(?<seconds>\d+)/.exec(data.headers["cache-control"])?.groups.seconds) * 1000;
            if (!Number.isNaN(expires.valueOf() - cacheTtl))
                newCacheEntry.dataTimestamp = expires.valueOf() - cacheTtl;
        }
        if (!newCacheEntry.dataTimestamp) {
            newCacheEntry.dataTimestamp = newCacheEntry.respondedAt;
            // console.log("DATA_TIMESTAMP not constructable");
        }

        // cache result
        if (parsedOptions.cacheFor && parsedOptions.interpret) {
            cache.set(parsedOptions.route, {
                timestamp: newCacheEntry.dataTimestamp - newCacheEntry.respondedAt + newCacheEntry.requestedAt, // The time the data was created at, roughly corrected (down to -1/2 RTT) to the local system time
                cacheFor: parsedOptions.cacheFor,
                raw: newCacheEntry
            });
        }

        resolve(parsedOptions.reuseJson ? newCacheEntry : {
            ...newCacheEntry,
            headers: JSON.parse(JSON.stringify(data.headers)),
            body: JSON.parse(data.body)
        });
    });

    return request.promise;
}

// this function must not throw, nothing is there to catch it
let queuesEmptying = new Set();
async function emptyQueue(ratelimit) {
    if (queuesEmptying.has(ratelimit)) {
        return;
    }
    queuesEmptying.add(ratelimit);

    while (!ratelimit.queue.isEmpty()) {
        // cannot empty if ratelimit is still exhausted
        if (ratelimit.remaining <= 0) {
            if (ratelimit.reset < Date.now()) {
                revitalizeRatelimit(ratelimit);
            } else {
                await sleep(500);
                continue;
            }
        }

        // cannot empty while too many requests where cast recently
        while (!ratelimits.GLOBAL.recent.isEmpty() && ratelimits.GLOBAL.recent.first() + 4000 < Date.now())
            ratelimits.GLOBAL.recent.shift();
        if (ratelimits.GLOBAL.recent.length >= 90) {
            await sleep(100);
            continue;
        }

        // cannot empty while too many requests are ongoing
        if (ratelimits.GLOBAL.ongoingRequestsAmount >= 50) {
            keepGoing = true;
            await sleep(50);
            continue;
        }

        // release first request from queue
        const req = ratelimit.queue.shift();
        ratelimits.GLOBAL.queuedAmount--;
        req.exitQueue();
    }

    queuesEmptying.delete(ratelimit);
}

// fetches the available leaderboard types
module.exports.fetchLeaderboardTypes = async function (options) {
    const parsedOptions = parseBaseRequestOptions(options);
    parsedOptions.route = config.routes.LEADERBOARDS.url.replace("%v", "types");
    parsedOptions.routeVersion = config.routes.LEADERBOARDS.version;
    parsedOptions.cacheFor ??= config.routes.LEADERBOARDS.cacheTime;
    const dataAPI = await module.exports.fetchRaw(parsedOptions);
    return new LeaderboardTypes(dataAPI, { source: parsedOptions.route });
}

// fetches a leaderboard
module.exports.fetchLeaderboard = async function (options) {
    const parsedOptions = parseLeaderboardRequestOptions(options);
    parsedOptions.route = config.routes.LEADERBOARDS.url.replace("%v", parsedOptions.query);
    parsedOptions.routeVersion = config.routes.LEADERBOARDS.version;
    parsedOptions.cacheFor ??= config.routes.LEADERBOARDS.cacheTime;
    const dataAPI = await module.exports.fetchRaw(parsedOptions);
    const isPlayer = dataAPI.body["1"].territories === undefined;
    const sorter = isPlayer ? getOrderedDescendingSorter(["score", "xp", "totalLevel"])
        : getOrderedDescendingSorter(
            parsedOptions.leaderboard === "guildTerritories" ? ["territories", "level", "xp", "warCount"] :
                parsedOptions.leaderboard === "guildWars" ? ["warCount", "level", "xp", "territories"] :
                    ["level", "xp", "territories", "warCount"]
        );
    return new List(Object.getOwnPropertyNames(dataAPI.body)
        .map(v => dataAPI.body[v].territories === undefined ?
            new LeaderboardPlayer(dataAPI.body[v], parsedOptions.leaderboard) :
            new LeaderboardGuild(dataAPI.body[v])
        ).sort(sorter), {
        requestedAt: dataAPI.requestedAt,
        respondedAt: dataAPI.respondedAt,
        receivedAt: dataAPI.receivedAt,
        timestamp: dataAPI.dataTimestamp,
        apiVersion: semVerFromHeader(dataAPI.headers["version"]),
        libVersion: "1.0.0",
        source: parsedOptions.route
    });
}

// Fetches the guild leaderboard
module.exports.fetchGuildLeaderboard = async function (options) {
    const parsedOptions = parseBaseRequestOptions(options);
    parsedOptions.route = config.routes.LEADERBOARDS.url.replace("%v", "guildTerritories");
    parsedOptions.routeVersion = config.routes.LEADERBOARDS.version;
    parsedOptions.cacheFor ??= config.routes.LEADERBOARDS.cacheTime;
    const dataAPI = await module.exports.fetchRaw(parsedOptions);
    return new List(Object.getOwnPropertyNames(dataAPI.body)
        .map(v => new LeaderboardGuild(dataAPI.body[v]))
        .sort((a, b) => (b.territories - a.territories) || (b.level - a.level) || (b.xp - a.xp)), {
        requestedAt: dataAPI.requestedAt,
        respondedAt: dataAPI.respondedAt,
        receivedAt: dataAPI.receivedAt,
        timestamp: dataAPI.dataTimestamp,
        apiVersion: semVerFromHeader(dataAPI.headers["version"]),
        libVersion: "1.1.0",
        source: parsedOptions.route
    });
};

// Fetches the player leaderboard
module.exports.fetchPlayerLeaderboard = async function (options) {
    const parsedOptions = parsePlayerLeaderboardRequestOptions(options);
    if (parsedOptions.apiVersion === "legacy")
        throw new WynncraftAPIError("PVP leaderboard has been removed");
    parsedOptions.route = config.routes.PLAYER_LEADERBOARD.url.replace("%v", parsedOptions.routePart);
    parsedOptions.routeVersion = config.routes.PLAYER_LEADERBOARD.version;
    parsedOptions.cacheFor ??= config.routes.PLAYER_LEADERBOARD.cacheTime;
    const dataAPI = await module.exports.fetchRaw(parsedOptions);
    const arr = dataAPI.body.data.map(v => new LegacyLeaderboardPlayer(v)).reverse();
    return new List(arr, {
        requestedAt: dataAPI.requestedAt,
        respondedAt: dataAPI.respondedAt,
        receivedAt: dataAPI.receivedAt,
        timestamp: dataAPI.dataTimestamp,
        apiVersion: dataAPI.body.version,
        libVersion: "2.0.0",
        source: parsedOptions.route
    });
};

// Fetches a player
module.exports.fetchPlayer = async function (options) {
    const parsedOptions = parsePlayerRequestOptions(options);
    parsedOptions.route = sanitizeURL(config.routes.PLAYER.url.replace("%v", parsedOptions.player));
    parsedOptions.routeVersion = config.routes.PLAYER.version;
    parsedOptions.cacheFor ??= config.routes.PLAYER.cacheTime;
    const dataAPI = await module.exports.fetchRaw(parsedOptions);
    const selected = await checkMultiChoice(dataAPI.body, dataAPI.status, parsedOptions, (k, v) => ({
        uuid: k,
        name: v.storedName,
        rank: {
            serverRank: v.rank?.toUpperCase() ?? "PLAYER",
            shortenedServerRank: v.shortenedRank ?? v.rank ?? "Player",
            donatorRank: v.supportRank?.toUpperCase().replace("VIPPLUS", "VIP+") ?? null,
            veteran: v.veteran ?? false,
            textColor: v.legacyRankColour?.main ?? null,
            backgroundColor: v.legacyRankColour?.sub ?? null,
            badgeUrl: CDN_URL + "/" + v.rankBadge
        },
        fetch: (options = parsedOptions) => module.exports.fetchPlayer({ ...options, player: k })
    }));
    if (selected !== undefined)
        return selected;
    return dataAPI.body === null ? null : new Player(dataAPI, { source: parsedOptions.route });
};

// Fetches a player UUID
module.exports.fetchPlayerUUID = async function (options) {
    const parsedOptions = parsePlayerUUIDRequestOptions(options);
    parsedOptions.route = sanitizeURL(config.routes.PLAYER_UUID.url.replace("%v", parsedOptions.player));
    parsedOptions.routeVersion = config.routes.PLAYER_UUID.version;
    parsedOptions.cacheFor ??= config.routes.PLAYER_UUID.cacheTime;
    const dataAPI = await module.exports.fetchRaw(parsedOptions);
    return dataAPI.body === null ? null : new UUID(dataAPI, { source: parsedOptions.route });
}

// Fetches a player characters ability tree
module.exports.fetchPlayerCharacterAbilityTree = async function (options) {
    const parsedOptions = parsePlayerCharacterAbilityTreeRequestOptions(options);
    const charTreeOptions = {
        ...parsedOptions,
        route: sanitizeURL(config.routes.PLAYER_CHARACTER_AT.url.replace("%v", parsedOptions.player).replace("%w", parsedOptions.character)),
        routeVersion: config.routes.PLAYER_CHARACTER_AT.version
    };
    charTreeOptions.cacheFor ??= config.routes.PLAYER_CHARACTER_AT.cacheTime;
    const mapOptions = {
        ...parsedOptions,
        route: sanitizeURL(config.routes.ABILITY_MAP.url.replace("%v", parsedOptions.class)),
        routeVersion: config.routes.ABILITY_MAP.version
    };
    mapOptions.cacheFor ??= config.routes.ABILITY_MAP.cacheTime;
    const treeOptions = {
        ...parsedOptions,
        route: sanitizeURL(config.routes.ABILITY_TREE.url.replace("%v", parsedOptions.class)),
        routeVersion: config.routes.ABILITY_TREE.version
    };
    treeOptions.cacheFor ??= config.routes.ABILITY_TREE.cacheTime;
    const [characterTree, tree, map] = await Promise.all([
        module.exports.fetchRaw(charTreeOptions),
        module.exports.fetchRaw(treeOptions),
        module.exports.fetchRaw(mapOptions)
    ]);
    const selected = await checkMultiChoice(characterTree.body, characterTree.status, parsedOptions, (k, v) => ({
        uuid: k,
        name: v.storedName,
        rank: {
            serverRank: v.rank?.toUpperCase() ?? "PLAYER",
            shortenedServerRank: v.shortenedRank ?? v.rank ?? "Player",
            donatorRank: v.supportRank?.toUpperCase().replace("VIPPLUS", "VIP+") ?? null,
            veteran: v.veteran ?? false,
            textColor: v.legacyRankColour?.main ?? null,
            backgroundColor: v.legacyRankColour?.sub ?? null,
            badgeUrl: CDN_URL + "/" + v.rankBadge
        },
        fetch: (options = parsedOptions) => module.exports.fetchPlayerCharacterAbilityTree({ ...options, player: k })
    }));
    if (selected !== undefined)
        return selected;
    return characterTree.body === null ? null : new PlayerCharacterAbilityTree(characterTree, tree, map, {
        source: parsedOptions.route,
        player: parsedOptions.player,
        character: parsedOptions.character,
        class: parsedOptions.class
    });
};

// fetches a generic ability tree
module.exports.fetchAbilityTree = async function (options) {
    const parsedOptions = parseOptionsWithClassType(options);
    const mapOptions = {
        ...parsedOptions,
        route: sanitizeURL(config.routes.ABILITY_MAP.url.replace("%v", parsedOptions.class)),
        routeVersion: config.routes.ABILITY_MAP.version
    };
    mapOptions.cacheFor ??= config.routes.ABILITY_MAP.cacheTime;
    const treeOptions = {
        ...parsedOptions,
        route: sanitizeURL(config.routes.ABILITY_TREE.url.replace("%v", parsedOptions.class)),
        routeVersion: config.routes.ABILITY_TREE.version
    };
    treeOptions.cacheFor ??= config.routes.ABILITY_TREE.cacheTime;
    const [map, tree] = await Promise.all([
        module.exports.fetchRaw(mapOptions),
        module.exports.fetchRaw(treeOptions)
    ]);
    return new AbilityTree(tree, map, {
        class: parsedOptions.class.toUpperCase(),
        requestedAt: tree.requestedAt,
        respondedAt: tree.respondedAt,
        receivedAt: tree.receivedAt,
        dataTimestamp: tree.dataTimestamp,
        apiVersion: semVerFromHeader(tree.headers["version"]),
        libVersion: "2.0.0",
        source: treeOptions.route
    });
}

// fetches the aspects for a class
module.exports.fetchAspects = async function (options) {
    const parsedOptions = parseOptionsWithClassType(options);
    parsedOptions.route = sanitizeURL(config.routes.ASPECT_LIST.url.replace("%v", parsedOptions.class));
    parsedOptions.routeVersion = config.routes.ASPECT_LIST.version;
    parsedOptions.cacheFor ??= config.routes.ASPECT_LIST.cacheTime;
    const dataAPI = await module.exports.fetchRaw(parsedOptions);
    return new List(Object.getOwnPropertyNames(dataAPI.body).map(name => new Aspect(dataAPI.body[name])), {
        requestedAt: dataAPI.requestedAt,
        respondedAt: dataAPI.respondedAt,
        receivedAt: dataAPI.receivedAt,
        timestamp: dataAPI.dataTimestamp,
        apiVersion: semVerFromHeader(dataAPI.headers["version"]),
        libVersion: "1.0.0",
        source: parsedOptions.route
    });
}

// Fetches a guild
module.exports.fetchGuild = async function (options) {
    const parsedOptions = parseGuildRequestOptions(options);
    parsedOptions.route = sanitizeURL(config.routes.GUILD.url.replace("%v", parsedOptions.path));
    parsedOptions.routeVersion = config.routes.GUILD.version;
    parsedOptions.cacheFor ??= config.routes.GUILD.cacheTime;
    const [dataAPI, territories] = parsedOptions.fetchAdditionalStats ?
        await Promise.all([
            module.exports.fetchRaw(parsedOptions),
            module.exports.fetchTerritoryList({ ...parsedOptions, allowCache: true })
        ]) :
        [await module.exports.fetchRaw(parsedOptions), null];
    const selected = await checkMultiChoice(dataAPI.body, dataAPI.status, parsedOptions, (k, v) => ({
        uuid: k,
        name: v.name,
        tag: v.prefix,
        level: v.level,
        memberCount: v.members,
        created: new Date(v.created),
        createdTimestamp: Date.parse(v.created),
        fetch: (options = parsedOptions) => module.exports.fetchGuild({ ...options, uuid: k })
    }));
    if (selected !== undefined)
        return selected;
    return dataAPI.body === null ? null : new Guild(dataAPI, {
        fetchAdditionalStats: parsedOptions.fetchAdditionalStats,
        territories: territories,
        source: parsedOptions.route,
    });
};

// Fetches all guild names
module.exports.fetchGuildList = async function (options) {
    const parsedOptions = parseBaseRequestOptions(options);
    parsedOptions.route = config.routes.GUILD_LIST.url;
    parsedOptions.routeVersion = config.routes.GUILD_LIST.version;
    parsedOptions.cacheFor ??= config.routes.GUILD_LIST.cacheTime;
    const dataAPI = await module.exports.fetchRaw(parsedOptions);
    return new List(Object.getOwnPropertyNames(dataAPI.body).map(uuid => new GuildListItem(uuid, dataAPI.body[uuid].name, dataAPI.body[uuid].prefix)), {
        requestedAt: dataAPI.requestedAt,
        respondedAt: dataAPI.respondedAt,
        receivedAt: dataAPI.receivedAt,
        timestamp: dataAPI.dataTimestamp,
        apiVersion: semVerFromHeader(dataAPI.headers["version"]),
        libVersion: "3.1.0",
        source: parsedOptions.route
    });
};

// Fetches the territory list
module.exports.fetchTerritoryList = async function (options) {
    const parsedOptions = parseBaseRequestOptions(options);
    parsedOptions.route = config.routes.TERRITORY_LIST.url;
    parsedOptions.routeVersion = config.routes.TERRITORY_LIST.version;
    parsedOptions.cacheFor ??= config.routes.TERRITORY_LIST.cacheTime;
    const dataAPI = await module.exports.fetchRaw(parsedOptions);
    const territitoryList = getTerritoryList(dataAPI.body);
    return new List(territitoryList, {
        requestedAt: dataAPI.requestedAt,
        respondedAt: dataAPI.respondedAt,
        receivedAt: dataAPI.receivedAt,
        timestamp: dataAPI.dataTimestamp,
        apiVersion: semVerFromHeader(dataAPI.headers["version"]),
        libVersion: "1.3.0",
        source: parsedOptions.route
    });
};

// Fetches the map locations
module.exports.fetchMapLocations = async function (options) {
    const parsedOptions = parseBaseRequestOptions(options);
    parsedOptions.route = config.routes.MAP_LOCATIONS.url;
    parsedOptions.version = config.routes.MAP_LOCATIONS.version;
    parsedOptions.cacheFor ??= config.routes.MAP_LOCATIONS.cacheTime;
    const mapMarkers = await module.exports.fetchRaw(parsedOptions);
    return new List(mapMarkers.body.map(v => new MapLocation(v)), {
        requestedAt: mapMarkers.requestedAt,
        respondedAt: mapMarkers.respondedAt,
        receivedAt: mapMarkers.receivedAt,
        timestamp: mapMarkers.dataTimestamp,
        apiVersion: semVerFromHeader(mapMarkers.headers["version"]),
        libVersion: "1.0.0",
        source: parsedOptions.route
    });
}

// Fetches the world list
module.exports.fetchOnlinePlayers = async function (options) {
    const parsedOptions = parseOnlinePlayersRequestOptions(options);
    parsedOptions.route = config.routes.ONLINE_PLAYERS.url.replace("%v", parsedOptions.identifier);
    parsedOptions.routeVersion = config.routes.ONLINE_PLAYERS.version;
    parsedOptions.cacheFor ??= config.routes.ONLINE_PLAYERS.cacheTime;
    const onlinePlayers = await module.exports.fetchRaw(parsedOptions);
    const worlds = Object.getOwnPropertyNames(onlinePlayers.body.players)
        .reduce((p, c) => {
            const world = onlinePlayers.body.players[c];
            if (!p[world])
                p[world] = [];
            p[world].push(c);
            return p;
        }, {});
    return new List(Object.getOwnPropertyNames(worlds).map(v => new World(v, worlds[v])), {
        requestedAt: onlinePlayers.requestedAt,
        respondedAt: onlinePlayers.respondedAt,
        receivedAt: onlinePlayers.receivedAt,
        timestamp: onlinePlayers.dataTimestamp,
        apiVersion: semVerFromHeader(onlinePlayers.headers["version"]),
        libVersion: "1.0.0",
        source: parsedOptions.route
    });
};

// Fetches the online player sum
module.exports.fetchOnlinePlayersSum = async function (options) {
    const parsedOptions = parseBaseRequestOptions(options);
    parsedOptions.route = config.routes.ONLINE_PLAYERS.url.replace("%v", "username");
    parsedOptions.routeVersion = config.routes.ONLINE_PLAYERS.version;
    parsedOptions.cacheFor ??= config.routes.ONLINE_PLAYERS.cacheTime;
    const onlinePlayers = await module.exports.fetchRaw(parsedOptions);
    return new OnlinePlayersSum(onlinePlayers, { source: parsedOptions.route });
};

// Fetches a name query
module.exports.fetchNames = async function (options) {
    const parsedOptions = parseNameRequestOptions(options);
    parsedOptions.route = sanitizeURL(config.routes.SEARCH.url.replace("%v", parsedOptions.query));
    parsedOptions.routeVersion = config.routes.SEARCH.version;
    parsedOptions.cacheFor ??= config.routes.SEARCH.cacheTime;
    const searchResult = await module.exports.fetchRaw(parsedOptions);
    return new NameSearch(searchResult, { source: parsedOptions.route, query: parsedOptions.query });
};

// Fetches all recipe IDs
module.exports.fetchRecipeList = async function (options) {
    const parsedOptions = parseBaseRequestOptions(options);
    parsedOptions.route = config.routes.RECIPE_LIST.url;
    parsedOptions.routeVersion = config.routes.RECIPE_LIST.version;
    parsedOptions.cacheFor ??= config.routes.RECIPE_LIST.cacheTime;
    const dataAPI = await module.exports.fetchRaw(parsedOptions);
    return new List(dataAPI.body.data.slice(), {
        requestedAt: dataAPI.requestedAt,
        respondedAt: dataAPI.respondedAt,
        receivedAt: dataAPI.receivedAt,
        timestamp: dataAPI.dataTimestamp,
        apiVersion: dataAPI.body.version,
        libVersion: "1.0.0",
        source: parsedOptions.route
    });
};

// Fetches all ingredient names
module.exports.fetchIngredientList = async function (options) {
    const parsedOptions = parseBaseRequestOptions(options);
    parsedOptions.route = config.routes.INGREDIENT_LIST.url;
    parsedOptions.routeVersion = config.routes.INGREDIENT_LIST.version;
    parsedOptions.cacheFor ??= config.routes.INGREDIENT_LIST.cacheTime;
    const dataAPI = await module.exports.fetchRaw(parsedOptions);
    return new List(dataAPI.body.data.slice(), {
        requestedAt: dataAPI.requestedAt,
        respondedAt: dataAPI.respondedAt,
        receivedAt: dataAPI.receivedAt,
        timestamp: dataAPI.dataTimestamp,
        apiVersion: dataAPI.body.version,
        libVersion: "1.0.0",
        source: parsedOptions.route
    });
};

// fetches recipes
module.exports.fetchRecipes = async function (options) {
    const parsedOptions = parseRecipeRequestOptions(options);
    parsedOptions.route = config.routes.RECIPE_SEARCH.url
    parsedOptions.routeVersion = config.routes.RECIPE_SEARCH.version;
    parsedOptions.cacheFor ??= config.routes.RECIPE_SEARCH.cacheTime;
    const dataAPI = await module.exports.fetchRaw(parsedOptions);
    let arr = dataAPI.body.data.map(v => new Recipe(v));
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
    return new List(arr, {
        requestedAt: dataAPI.requestedAt,
        respondedAt: dataAPI.respondedAt,
        receivedAt: dataAPI.receivedAt,
        timestamp: dataAPI.dataTimestamp,
        apiVersion: dataAPI.body.version,
        libVersion: "1.0.0",
        source: parsedOptions.route
    });
};

// Fetches Ingredients
module.exports.fetchIngredients = async function (options) {
    const parsedOptions = parseIngredientRequestOptions(options);
    parsedOptions.route = config.routes.INGREDIENT_SEARCH.url;
    parsedOptions.routeVersion = config.routes.INGREDIENT_SEARCH.version;
    parsedOptions.cacheFor ??= config.routes.INGREDIENT_SEARCH.cacheTime;
    const dataAPI = await module.exports.fetchRaw(parsedOptions);
    let arr = dataAPI.body.data.map(v => new Ingredient(v));
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
    return new List(arr, {
        requestedAt: dataAPI.requestedAt,
        respondedAt: dataAPI.respondedAt,
        receivedAt: dataAPI.receivedAt,
        timestamp: dataAPI.dataTimestamp,
        apiVersion: dataAPI.body.version,
        libVersion: "1.0.0",
        source: parsedOptions.route
    });
}

// Fetches items
module.exports.fetchItems = async function (options) {
    const parsedOptions = parseItemRequestOptions(options);
    parsedOptions.route = config.routes.ITEMS.url;
    parsedOptions.routeVersion = config.routes.ITEMS.version;
    parsedOptions.cacheFor ??= config.routes.ITEMS.cacheTime;
    const itemList = await module.exports.fetchRaw(parsedOptions);
    let arr = Object.getOwnPropertyNames(itemList.body).map(v => ({ k: v, v: itemList.body[v] }))
        .filter(({ v }) => ["weapon", "armour", "accessory"].includes(v.type))
        .map(({ k, v }) => new Item(k, v));
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
            arr = arr.filter(v0 => parsedOptions.majorIds.list.every(v1 => v0.majorId && v0.majorId.name.toUpperCase() === v1));
        } else {
            arr = arr.filter(v0 => parsedOptions.majorIds.list.some(v1 => v0.majorId && v0.majorId.name.toUpperCase() === v1));
        }
    }
    return new List(arr, {
        requestedAt: itemList.requestedAt,
        respondedAt: itemList.respondedAt,
        receivedAt: itemList.receivedAt,
        timestamp: itemList.dataTimestamp,
        apiVersion: semVerFromHeader(itemList.headers["version"]),
        libVersion: "2.0.0",
        source: parsedOptions.route
    });
}

// Fetches self location
module.exports.fetchMyLocation = async function (options) {
    const parsedOptions = parseBaseRequestOptions(options);
    parsedOptions.route = config.routes.MY_LOCATION.url;
    parsedOptions.routeVersion = config.routes.MY_LOCATION.version;
    parsedOptions.cacheFor ??= config.routes.MY_LOCATION.cacheTime;
    let party;
    let arr;
    try {
        party = await module.exports.fetchRaw(parsedOptions);
        arr = party.body.map(v => new PlayerParty(v));
    } catch (e) {
        if (e.message === "You are not online on the Wynncraft network.") { // If IP is not logged in, return null
            return null;
        } else {
            throw e;
        }
    }
    return new List(arr, {
        requestedAt: party.requestedAt,
        respondedAt: party.respondedAt,
        receivedAt: party.receivedAt,
        timestamp: party.dataTimestamp,
        apiVersion: semVerFromHeader(party.headers["version"]),
        libVersion: "2.0.0",
        source: parsedOptions.route
    });
}

// Fetches quest count
module.exports.fetchQuestCount = async function (options) {
    const parsedOptions = parseBaseRequestOptions(options);
    parsedOptions.route = config.routes.QUEST_COUNT.url;
    parsedOptions.routeVersion = config.routes.QUEST_COUNT.version;
    parsedOptions.cacheFor ??= config.routes.QUEST_COUNT.cacheTime;
    const data = await module.exports.fetchRaw(parsedOptions);
    return new QuestCount(data, { source: parsedOptions.route });
}

// Backloaded dependencies to avoid warnings on circular dependencies
const BaseAPIObject = require("./models/BaseAPIObject.js");
const Player = require("./models/Player.js");
const PlayerClass = require("./models/PlayerClass.js");
const GuildListItem = require("./models/GuildListItem.js");
const Guild = require("./models/Guild.js");
const GuildMember = require("./models/GuildMember.js");
const List = require("./models/List.js");
const Territory = require("./models/Territory.js");
const World = require("./models/World.js");
const OnlinePlayersSum = require("./models/OnlinePlayersSum.js");
const LeaderboardTypes = require("./models/LeaderboardTypes.js");
const LeaderboardGuild = require("./models/LeaderboardGuild.js");
const LeaderboardPlayer = require("./models/LeaderboardPlayer.js");
const LegacyLeaderboardPlayer = require("./models/LegacyLeaderboardPlayer.js");
const Recipe = require("./models/Recipe.js");
const Ingredient = require("./models/Ingredient.js");
const Item = require("./models/Item.js");
const NameSearch = require("./models/NameSearch.js");
const MapLocation = require("./models/MapLocation.js");
const PlayerParty = require("./models/PlayerParty.js");
const PlayerPartyMember = require("./models/PlayerPartyMember.js");
const UUID = require("./models/UUID.js");
const QuestCount = require("./models/QuestCount.js");
const Ability = require("./models/Ability.js");
const AbilityConnectorNode = require("./models/AbilityConnectorNode.js");
const AbilityTree = require("./models/AbilityTree.js");
const PlayerCharacterAbilityTree = require("./models/PlayerCharacterAbilityTree.js");
const Aspect = require("./models/Aspect.js");
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
    sanitizeURL,
    sleep,
    requestJsonApi,
    interpretApiContent,
    pingTimes,
    getTerritoryList,
    semVerFromHeader,
    revitalizeRatelimit,
    parseOnlinePlayersRequestOptions,
    CDN_URL,
    checkMultiChoice,
    parseLeaderboardRequestOptions,
    parsePlayerCharacterAbilityTreeRequestOptions,
    parseOptionsWithClassType,
    getOrderedDescendingSorter,
} = require("./util.js");

module.exports.WynncraftAPIError = WynncraftAPIError;
module.exports.MultipleChoicesError = MultipleChoicesError;
module.exports.BaseAPIObject = BaseAPIObject;
module.exports.Player = Player;
module.exports.PlayerClass = PlayerClass;
module.exports.GuildListItem = GuildListItem;
module.exports.Guild = Guild;
module.exports.GuildMember = GuildMember;
module.exports.List = List;
module.exports.Territory = Territory;
module.exports.World = World;
module.exports.OnlinePlayersSum = OnlinePlayersSum;
module.exports.LeaderboardTypes = LeaderboardTypes;
module.exports.LeaderboardPlayer = LeaderboardPlayer;
module.exports.LegacyLeaderboardPlayer = LegacyLeaderboardPlayer;
module.exports.LeaderboardGuild = LeaderboardGuild;
module.exports.Recipe = Recipe;
module.exports.Ingredient = Ingredient;
module.exports.Item = Item;
module.exports.NameSearch = NameSearch;
module.exports.MapLocation = MapLocation;
module.exports.PlayerParty = PlayerParty;
module.exports.PlayerPartyMember = PlayerPartyMember;
module.exports.UUID = UUID;
module.exports.QuestCount = QuestCount;
module.exports.Ability = Ability;
module.exports.AbilityConnectorNode = AbilityConnectorNode;
module.exports.AbilityTree = AbilityTree;
module.exports.PlayerCharacterAbilityTree = PlayerCharacterAbilityTree;
module.exports.Aspect = Aspect;
