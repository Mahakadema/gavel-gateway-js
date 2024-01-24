
const { flushCache } = require(".");
const { Queue, PriorityQueue } = require("./Queue.js");

const config = {
    maxQueueLength: 50,
    allowCacheByDefault: true,
    apiKeys: [],
    defaultRetries: 3,
    defaultTimeout: 30000,
    throwOnRatelimitError: false,
    routes: {
        // When adding / removing routes, document them properly in the cache time options
        // PLAYER_V3: {
        //     url: "https://api.wynncraft.com/v3/player/%v?fullResult",
        //     cacheTime: 120_000,
        //     version: null,
        //     // apiVersion: "v3"
        // },
        PLAYER: {
            url: "https://api.wynncraft.com/v2/player/%v/stats",
            cacheTime: 1_800_000,
            version: "2.1.0",
        },
        // TODO: v3 doesn't exist yet
        PLAYER_UUID: {
            url: "https://api.wynncraft.com/v2/player/%v/uuid",
            cacheTime: 1800000,
            version: "2.1.0",
        },
        PLAYER_LEADERBOARD: {
            url: "https://api.wynncraft.com/v2/leaderboards/player/%v",
            cacheTime: 3600000,
            version: "2.2.0",
        },
        LEADERBOARDS: {
            url: "https://api.wynncraft.com/v3/leaderboards/%v",
            cacheTime: 3_600_000,
            version: null,
        },
        GUILD: {
            url: "https://api.wynncraft.com/v3/guild/%v?identifier=uuid",
            cacheTime: 120_000,
            version: null,
        },
        GUILD_LIST: {
            url: "https://api.wynncraft.com/v3/guild/list/guild",
            cacheTime: 3_600_000,
            version: null,
        },
        TERRITORY_LIST: {
            url: "https://api.wynncraft.com/v3/guild/list/territory",
            cacheTime: 10_000,
            version: null,
        },
        INGREDIENT_SEARCH: {
            url: "https://api.wynncraft.com/v2/ingredient/search/skills/%5Earmouring," +
                "tailoring,woodworking,weaponsmithing,scribing,alchemism,cooking,jeweling",
            cacheTime: 3600000,
            version: "2.1.0",
        },
        INGREDIENT_LIST: {
            url: "https://api.wynncraft.com/v2/ingredient/list",
            cacheTime: 3600000,
            version: "2.1.0",
        },
        RECIPE_SEARCH: {
            url: "https://api.wynncraft.com/v2/recipe/search/level/%5Emin%3C1%3E,min%3C3%3E," +
                "min%3C5%3E,min%3C7%3E,min%3C10%3E,min%3C13%3E,min%3C15%3E,min%3C17%3E,min%3C20%3E," +
                "min%3C23%3E,min%3C25%3E,min%3C27%3E,min%3C30%3E,min%3C33%3E,min%3C35%3E,min%3C37%3E," +
                "min%3C40%3E,min%3C43%3E,min%3C45%3E,min%3C47%3E,min%3C50%3E,min%3C53%3E,min%3C55%3E," +
                "min%3C57%3E,min%3C60%3E,min%3C63%3E,min%3C65%3E,min%3C67%3E,min%3C70%3E,min%3C73%3E," +
                "min%3C75%3E,min%3C77%3E,min%3C80%3E,min%3C83%3E,min%3C85%3E,min%3C87%3E,min%3C90%3E," +
                "min%3C93%3E,min%3C95%3E,min%3C97%3E,min%3C100%3E,min%3C103%3E,min%3C105%3E," +
                "min%3C107%3E,min%3C110%3E,min%3C113%3E,min%3C115%3E,min%3C117%3E,min%3C120%3E," +
                "min%3C123%3E,min%3C125%3E,min%3C127%3E,min%3C130%3E",
            cacheTime: 3600000,
            version: "2.1.0",
        },
        RECIPE_LIST: {
            url: "https://api.wynncraft.com/v2/recipe/list",
            cacheTime: 3600000,
            version: "2.1.0",
        },
        ITEMS: {
            url: "https://api.wynncraft.com/v3/item/database?fullResult",
            cacheTime: 3600000,
            version: null,
        },
        ONLINE_PLAYERS: {
            url: "https://api.wynncraft.com/v3/player?identifier=%v",
            cacheTime: 30000,
            version: null,
        },
        SEARCH: {
            url: "https://api.wynncraft.com/v3/search/%v",
            cacheTime: 3_600_000,
            version: null,
        },
        MAP_LOCATIONS: {
            url: "https://api.wynncraft.com/v3/map/locations/markers",
            cacheTime: 30000,
            version: null,
        },
        MY_LOCATION: {
            url: "https://api.wynncraft.com/v3/map/locations/player",
            cacheTime: 5000,
            version: null,
        },
        QUEST_COUNT: {
            url: "https://api.wynncraft.com/v3/map/quests",
            cacheTime: 30000,
            version: null,
        }
    }
}

// ratelimits
const ratelimits = {
    // DEFAULT_LEGACY: {
    //     value: null,
    //     apiVersions: ["legacy", "v2"],
    //     limit: 180,
    //     remaining: 0,
    //     interval: 60000,
    //     reset: Date.now() - 1001,
    //     ongoingRequestsAmount: 0,
    //     queue: new PriorityQueue()
    // },
    DEFAULT: {
        value: null,
        apiVersions: ["legacy", "v2", "v3"],
        limit: 180,
        remaining: 0,
        interval: 60000,
        reset: Date.now() - 1001,
        ongoingRequestsAmount: 0,
        queue: new PriorityQueue()
    },
    GLOBAL: {
        ongoingRequestsAmount: 0,
        queuedAmount: 0,
        recent: new Queue()
    }
};

module.exports.config = config;
module.exports.ratelimits = ratelimits;

module.exports.set = function (configOptions) {
    configOptions ??= {};
    // queue length
    if (configOptions.maxQueueLength !== undefined && configOptions.maxQueueLength !== null) {
        if (Number.isInteger(configOptions.maxQueueLength)) {
            config.maxQueueLength = configOptions.maxQueueLength;
        } else {
            throw new TypeError(`Expected 'maxQueueLength' to be an integer number, but received ${typeof configOptions.maxQueueLength} instead`);
        }
    }
    // allow cache
    if (configOptions.allowCacheByDefault !== undefined && configOptions.allowCacheByDefault !== null) {
        if (typeof configOptions.allowCacheByDefault === "boolean") {
            config.allowCacheByDefault = configOptions.allowCacheByDefault;
        } else {
            throw new TypeError(`Expected 'allowCacheByDefault' to be a boolean, but received ${typeof configOptions.allowCacheByDefault} instead`);
        }
    }
    // API keys
    if (configOptions.apiKeys) {
        if (Array.isArray(configOptions.apiKeys) && configOptions.apiKeys.every(v => v && typeof v.key === "string" && !["DEFAULT", "DEFAULT_LEGACY"].includes(v.key) && Number.isInteger(v.limit) && v.limit > 0 && Number.isInteger(v.interval) && v.interval > 0)) {
            const removedKeys = config.apiKeys.filter(v => !configOptions.apiKeys.find(v1 => v1.key === v.key));
            const newKeys = configOptions.apiKeys.filter(v => !config.apiKeys.find(v1 => v1.key === v.key));
            // set
            config.apiKeys.splice(0, config.apiKeys.length, ...configOptions.apiKeys);
            // remove old
            for (const key of removedKeys) {
                ratelimits[key.key] = undefined;
            }
            // initialize new
            for (const key of newKeys) {
                ratelimits[key.key] = {
                    value: key.key,
                    apiVersions: ["legacy", "v2", "v3"],
                    limit: undefined,
                    remaining: 0,
                    interval: undefined,
                    reset: Date.now() - 1001,
                    ongoingRequestsAmount: 0,
                    queue: new PriorityQueue()
                }
            }
            for (const key of configOptions.apiKeys) {
                ratelimits[key.key].limit = key.limit;
                ratelimits[key.key].interval = key.interval;
            }
        } else {
            throw new TypeError(`Expected 'apiKeys' to be an array of ApiKeys, but received ${typeof configOptions.apiKeys} instead`);
        }
    }
    // retries
    if (configOptions.defaultRetries !== undefined && configOptions.defaultRetries !== null) {
        if (Number.isInteger(configOptions.defaultRetries)) {
            config.defaultRetries = configOptions.defaultRetries;
        } else {
            throw new TypeError(`Expected 'defaultRetries' to be an integer number, but received ${typeof configOptions.defaultRetries} instead`);
        }
    }
    // timeout
    if (configOptions.defaultTimeout !== undefined && configOptions.defaultTimeout !== null) {
        if (Number.isInteger(configOptions.defaultTimeout)) {
            config.defaultTimeout = configOptions.defaultTimeout;
        } else {
            throw new TypeError(`Expected 'defaultTimeout' to be an integer number, but received ${typeof configOptions.defaultTimeout} instead`);
        }
    }
    // throw on ratelimit
    if (configOptions.throwOnRatelimitError !== undefined && configOptions.throwOnRatelimitError !== null) {
        if (typeof configOptions.throwOnRatelimitError === "boolean") {
            config.throwOnRatelimitError = configOptions.throwOnRatelimitError;
        } else {
            throw new TypeError(`Expected 'throwOnRatelimitError' to be a boolean, but received ${typeof configOptions.throwOnRatelimitError} instead`);
        }
    }
    // cache times
    if (configOptions.defaultCacheTimes) {
        for (const route of Object.getOwnPropertyNames(config.routes)) {
            if (configOptions.defaultCacheTimes[route] || configOptions.defaultCacheTimes[route] === 0) {
                if (!Number.isInteger(configOptions.defaultCacheTimes[route]))
                    throw new TypeError(`Expected '${route}' to be an integer number, but received ${typeof configOptions.defaultCacheTimes[route]} instead`);
                config.routes[route].cacheTime = configOptions.defaultCacheTimes[route];
            }
        }
    }

    const copy = { ...config };
    copy.apiKeys = copy.apiKeys.map(v => ({ ...v }));
    copy.routes = { ...copy.routes };
    for (const r of Object.getOwnPropertyNames(copy.routes)) {
        copy.routes[r] = { ...copy.routes[r] };
        if (Array.isArray(copy.routes[r].version))
            copy.routes[r].version = copy.routes[r].version.slice();
    }
    return copy;
}
