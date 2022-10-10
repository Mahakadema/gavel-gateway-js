
const { flushCache } = require(".");
const Queue = require("./Queue.js");

const config = {
    maxQueueLength: 50,
    allowCacheByDefault: true,
    allowStackingByDefault: true,
    reuseJson: true,
    apiKeys: [],
    defaultRetries: 3,
    defaultTimeout: 30000,
    routes: {
        PLAYER: {
            url: "https://api.wynncraft.com/v2/player/%v/stats",
            cacheTime: 600000,
            version: "2.1.0"
        },
        PLAYER_LEADERBOARD: {
            url: "https://api.wynncraft.com/v2/leaderboards/player/%v",
            cacheTime: 3600000,
            version: "2.2.0"
        },
        PLAYER_PVP_LEADERBOARD: {
            url: "https://api.wynncraft.com/public_api.php?action=statsLeaderboard&type=pvp&timeframe=alltime",
            cacheTime: 30000,
            version: 1.3
        },
        GUILD: {
            url: "https://api.wynncraft.com/public_api.php?action=guildStats&command=%v",
            cacheTime: 30000,
            version: 1
        },
        GUILD_LIST: {
            url: "https://api.wynncraft.com/public_api.php?action=guildList",
            cacheTime: 600000,
            version: 1
        },
        GUILD_LEADERBOARD: {
            url: "https://api.wynncraft.com/public_api.php?action=statsLeaderboard&type=guild&timeframe=alltime",
            cacheTime: 30000,
            version: 1.3
        },
        TERRITORY_LIST: {
            url: "https://api.wynncraft.com/public_api.php?action=territoryList",
            cacheTime: 30000,
            version: 1
        },
        INGREDIENT_SEARCH: {
            url: "https://api.wynncraft.com/v2/ingredient/search/skills/%5Earmouring," +
                "tailoring,woodworking,weaponsmithing,scribing,alchemism,cooking,jeweling",
            cacheTime: 3600000,
            version: "2.1.0"
        },
        INGREDIENT_LIST: {
            url: "https://api.wynncraft.com/v2/ingredient/list",
            cacheTime: 3600000,
            version: "2.1.0"
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
            version: "2.1.0"
        },
        RECIPE_LIST: {
            url: "https://api.wynncraft.com/v2/recipe/list",
            cacheTime: 3600000,
            version: "2.1.0"
        },
        ITEM_SEARCH: {
            url: "https://api.wynncraft.com/public_api.php?action=itemDB&category=all",
            cacheTime: 3600000,
            version: 1.4
        },
        ATHENA_ITEMS: {
            url: "https://athena.wynntils.com/cache/get/itemList",
            cacheTime: 86400000,
            version: null
        },
        ONLINE_PLAYERS: {
            url: "https://api.wynncraft.com/public_api.php?action=onlinePlayers",
            cacheTime: 30000,
            version: 1.2
        },
        ONLINE_PLAYERS_SUM: {
            url: "https://api.wynncraft.com/public_api.php?action=onlinePlayersSum",
            cacheTime: 30000,
            version: 1.2
        },
        NAME_SEARCH: {
            url: "https://api.wynncraft.com/public_api.php?action=statsSearch&search=%v",
            cacheTime: 600000,
            version: 1
        },
        MAP_LOCATIONS: {
            url: "https://api.wynncraft.com/public_api.php?action=mapLocations",
            cacheTime: 30000,
            version: null // Doesn't have a version field
        },
        MY_LOCATION: {
            url: "https://api.wynncraft.com/map/getMyLocation",
            cacheTime: 15000,
            version: null // Doesn't have a version field
        }
    }
}

// ratelimits
const ratelimits = {
    DEFAULT: {
        value: null,
        limit: 180,
        remaining: 0,
        interval: 60000,
        reset: Date.now() - 1001,
        ongoingRequestsAmount: 0,
        queue: [],
        priorityQueue: []
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
    // allow stacking
    if (configOptions.allowStackingByDefault !== undefined && configOptions.allowStackingByDefault !== null) {
        if (typeof configOptions.allowStackingByDefault === "boolean") {
            config.allowStackingByDefault = configOptions.allowStackingByDefault;
        } else {
            throw new TypeError(`Expected 'allowStackingByDefault' to be a boolean, but received ${typeof configOptions.allowStackingByDefault} instead`);
        }
    }
    // reuse JSON
    if (configOptions.reuseJson !== undefined && configOptions.reuseJson !== null) {
        if (typeof configOptions.reuseJson === "boolean") {
            if (config.reuseJson !== configOptions.reuseJson)
                flushCache();
            config.reuseJson = configOptions.reuseJson;
        } else {
            throw new TypeError(`Expected 'reuseJson' to be a boolean, but received ${typeof configOptions.reuseJson} instead`);
        }
    }
    // API keys
    if (configOptions.apiKeys) {
        if (Array.isArray(configOptions.apiKeys) && configOptions.apiKeys.every(v => v && typeof v.key === "string" && v.key !== "DEFAULT" && Number.isInteger(v.limit) && v.limit > 0 && Number.isInteger(v.interval) && v.interval > 0)) {
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
                    limit: null,
                    remaining: 0,
                    interval: null,
                    reset: Date.now() - 1001,
                    ongoingRequestsAmount: 0,
                    queue: [],
                    priorityQueue: []
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
    // cache times
    if (configOptions.defaultCacheTimes) {
        for (const route in config.routes) {
            if (route !== "ATHENA_ITEMS" && config.routes.hasOwnProperty(route) && configOptions.defaultCacheTimes.hasOwnProperty(route) && configOptions.defaultCacheTimes[route] !== null && configOptions.defaultCacheTimes[route] !== undefined) {
                if (Number.isInteger(configOptions.defaultCacheTimes[route])) {
                    config.routes[route].cacheTime = configOptions.defaultCacheTimes[route];
                } else {
                    throw new TypeError(`Expected '${route}' to be an integer number, but received ${typeof configOptions.defaultCacheTimes[route]} instead`);
                }
            }
        }
    }

    const copy = { ...config };
    copy.apiKeys = copy.apiKeys.map(v => { return { ...v }; });
    copy.routes = { ...copy.routes };
    for (const r in copy.routes) {
        if (copy.routes.hasOwnProperty(r))
            copy.routes[r] = { ...copy.routes[r] };
    }
    return copy;
}
