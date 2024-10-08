
const WynncraftAPIError = require("./WynncraftAPIError.js");
const https = require("https");
const config = require("./config.js").config;
const minecraftIds = require("../data/minecraftIds.json");
const identifications = require("../data/identifications.json");
const territoryData = require("../data/territories.json");
const Territory = require("./models/Territory.js");
const MultipleChoicesError = require("./MultipleChoicesError.js");

const identificationSpecifiers = identifications.map(v => sctocc(v.name));
// ["strength", "dexterity", "intelligence", "defence", "agility", "mainAttackDamagePercent", "mainAttackDamageRaw", "spellDamagePercent", "spellDamageRaw", "rainbowSpellDamageRaw", "earthDamage", "thunderDamage", "waterDamage", "fireDamage", "airDamage", "earthDefence", "thunderDefence", "waterDefence", "fireDefence", "airDefence", "healthRegenPercent", "healthRegenRaw", "health", "lifeSteal", "manaRegen", "manaSteal", "spellCostPct1", "spellCostRaw1", "spellCostPct2", "spellCostRaw2", "spellCostPct3", "spellCostRaw3", "spellCostPct4", "spellCostRaw4", "attackSpeed", "poison", "thorns", "reflection", "exploding", "jumpHeight", "walkSpeed", "sprintDuration", "sprintRegen", "soulPointRegen", "gatheringSpeed", "gatheringXpBonus", "xpBonus", "lootBonus", "lootQuality", "stealing"];
const restrictedIdSpecifiers = ["durability", "strengthRequirement", "dexterityRequirement", "intelligenceRequirement", "defenceRequirement", "agilityRequirement", "attackSpeed", "powderSlots", "duration", "charges"];
const positionModifierSpecifiers = ["right", "left", "above", "under", "touching", "notTouching"];

// pings of recent requests
module.exports.pingTimes = [];

// resolves after an amount of milliseconds
module.exports.sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// parses request options into a workable format
module.exports.parseBaseRequestOptions = function (options) {
    const obj = {
        apiKey: null,
        allowCache: config.allowCacheByDefault,
        priority: false,
        retries: config.defaultRetries,
        timeout: config.defaultTimeout,
        cacheFor: null,
        ignoreVersion: false
    };

    options ??= {};

    if (typeof options !== "object")
        throw new TypeError(`expected 'options' to be a RequestOptions object, but received ${typeof options} instead`);

    if (options.hasOwnProperty("apiKey")) {
        if (options.apiKey !== undefined && options.apiKey !== null && config.apiKeys.find(v => v.key === options.apiKey))
            throw new TypeError("'apiKey' must be an API key registered in the config");
        obj.apiKey = options.apiKey;
    }
    if (options.hasOwnProperty("allowCache")) {
        if (typeof options.allowCache !== "boolean")
            throw new TypeError("'allowCache' must be a boolean");
        obj.allowCache = options.allowCache;
    }
    if (options.hasOwnProperty("priority")) {
        if (typeof options.priority !== "boolean")
            throw new TypeError("'priority' must be a boolean");
        obj.priority = options.priority;
    }
    if (options.hasOwnProperty("retries")) {
        if (!Number.isInteger(options.retries))
            throw new TypeError("'retries' must be an integer number");
        if (options.retries < 0)
            throw new RangeError("'retries' must be non-negative");
        obj.retries = options.retries;
    }
    if (options.hasOwnProperty("cacheFor")) {
        if (!Number.isInteger(options.cacheFor))
            throw new TypeError("'cacheFor' must be an integer number of milliseconds");
        obj.cacheFor = options.cacheFor;
    }
    if (options.hasOwnProperty("timeout")) {
        if (!Number.isInteger(options.timeout))
            throw new TypeError("'timeout' must be an integer number of milliseconds");
        if (options.timeout < 0)
            throw new RangeError("'timeout' must be non-negative");
        obj.timeout = options.timeout;
    }
    if (options.hasOwnProperty("ignoreVersion")) {
        if (typeof options.ignoreVersion !== "boolean")
            throw new TypeError("'ignoreVersion' must be a boolean");
        obj.ignoreVersion = options.ignoreVersion;
    }

    return obj;
}

module.exports.parseSelectingRequestOptions = function (options) {
    options ??= {};

    const o = module.exports.parseBaseRequestOptions(options);
    o.asyncSelector = false;

    if (options.multipleChoicesSelector) {
        if (typeof options.multipleChoicesSelector !== "function")
            throw new TypeError("'multipleChoicesSelector' must be a function");
        o.multipleChoicesSelector = options.multipleChoicesSelector;
    }

    return o;
}

// parses fetchRaw options
module.exports.parseRawRequestOptions = function (options) {
    if (typeof options === "string")
        options = { route: options };

    options ??= {};

    if (typeof options !== "object")
        throw new TypeError(`expected 'options' to be a RawRequestOptions object, but received ${typeof options} instead`);

    const o = module.exports.parseBaseRequestOptions(options);
    o.interpret = true;
    o.cacheFor ??= 30000;
    o.routeVersion = null;
    o.reuseJson = true;

    if (options.route === undefined)
        throw new TypeError("'route' has to be defined");
    if (typeof options.route !== "string")
        throw new TypeError("'route' must be a URL string");
    if (!/^(https:\/\/)?(api\.wynncraft\.com)\//.test(options.route))
        throw new URIError("URL in 'route' does not refer to the Wynncraft API");
    o.route = module.exports.sanitizeURL(options.route);
    o.apiVersion = /^(https:\/\/)?api\.wynncraft\.com\/v2\//.test(o.route) ? "v2" :
        /^(https:\/\/)?api\.wynncraft\.com\/v3\//.test(o.route) ? "v3" : "legacy";


    if (options.hasOwnProperty("reuseJson")) {
        if (typeof options.reuseJson !== "boolean")
            throw new TypeError("'reuseJson' must be a boolean");
        o.reuseJson = options.reuseJson;
    }

    if (options.hasOwnProperty("interpret")) {
        if (typeof options.interpret !== "boolean")
            throw new TypeError("'interpret' must be a boolean");
        o.interpret = options.interpret;
    }

    if (options.hasOwnProperty("routeVersion")) {
        const isInvalid = (val) => !Number.isInteger(val * 10) && !/^[0-9]+\.[0-9]+\.[0-9]+$/.test(val);
        if (Array.isArray(options.routeVersion) ? options.routeVersion.some(isInvalid) : isInvalid(options.routeVersion))
            throw new TypeError("'routeVersion' must be a valid route version (number with 1 decimal digit or semantic version string)");
        o.routeVersion = options.routeVersion;
    }

    return o;
}

// parses player leaderboard options
module.exports.parsePlayerLeaderboardRequestOptions = function (options) {
    const soloLbs = [
        { name: "COMBAT", apiVersion: "v2", route: "solo/combat" },
        { name: "PROFESSION", apiVersion: "v2", route: "solo/profession" },
        { name: "COMBINED", apiVersion: "v2", route: "solo/overall" },
        { name: "MINING", apiVersion: "v2", route: "solo/mining" },
        { name: "WOODCUTTING", apiVersion: "v2", route: "solo/woodcutting" },
        { name: "FARMING", apiVersion: "v2", route: "solo/farming" },
        { name: "FISHING", apiVersion: "v2", route: "solo/fishing" },
        { name: "SCRIBING", apiVersion: "v2", route: "solo/scribing" },
        { name: "COOKING", apiVersion: "v2", route: "solo/cooking" },
        { name: "ALCHEMISM", apiVersion: "v2", route: "solo/alchemism" },
        { name: "WOODWORKING", apiVersion: "v2", route: "solo/woodworking" },
        { name: "WEAPONSMITHING", apiVersion: "v2", route: "solo/weaponsmithing" },
        { name: "TAILORING", apiVersion: "v2", route: "solo/tailoring" },
        { name: "ARMORING", apiVersion: "v2", route: "solo/armouring" },
        { name: "JEWELING", apiVersion: "v2", route: "solo/jeweling" }
    ];
    const totalLbs = [
        { name: "COMBAT", apiVersion: "v2", route: "overall/combat" },
        { name: "PROFESSION", apiVersion: "v2", route: "overall/profession" },
        { name: "COMBINED", apiVersion: "v2", route: "overall/all" },
        { name: "PVP", apiVersion: "legacy", route: "PVP" }
    ]

    if (typeof options === "string")
        options = { type: options };

    options ??= {};

    if (typeof options !== "object")
        throw new TypeError(`expected 'options' to be a PlayerLeaderboardRequestOptions object, but received ${typeof options} instead`);

    const o = module.exports.parseBaseRequestOptions(options);

    let scope = "TOTAL";
    o.apiVersion = totalLbs[0].apiVersion;
    o.routePart = totalLbs[0].route;

    if (options.hasOwnProperty("scope")) {
        if (!["TOTAL", "SOLO"].includes(options.scope?.toUpperCase()))
            throw new TypeError("'scope' must be a valid PlayerLeaderboardScope");
        scope = options.scope.toUpperCase();
    }

    if (options.hasOwnProperty("type")) {
        const lb = (scope === "TOTAL" ? totalLbs : soloLbs).find(v => v.name === options.type?.toUpperCase());
        if (!lb)
            throw new TypeError(`'type' must be a valid Player${scope === "TOTAL" ? "Total" : "Solo"}LeaderboardType`);
        o.apiVersion = lb.apiVersion;
        o.routePart = lb.route;
    }

    return o;
}

// parses leaderboard options
module.exports.parseLeaderboardRequestOptions = function (options) {
    if (typeof options === "string")
        options = { leaderboard: options };

    const o = module.exports.parseBaseRequestOptions(options);

    o.limit = 100;
    if (options.limit) {
        if (typeof options.limit !== "number" || options.limit < 0 || options.limit > 1000)
            throw new TypeError("'limit' must be a number between 0 and 1000");
        o.limit = options.limit;
    }

    if (!options.leaderboard || typeof options.leaderboard !== "string" || options.leaderboard === "types")
        throw new TypeError("'leaderboard' must be a PlayerLeaderboardType or GuildLeaderboardType");
    o.leaderboard = options.leaderboard;
    o.query = `${o.leaderboard}?resultLimit=${o.limit}`;

    return o;
}

// parses player options
module.exports.parsePlayerRequestOptions = function (options) {
    if (typeof options === "string")
        options = { player: options };

    options ??= {};

    if (typeof options !== "object")
        throw new TypeError(`expected 'options' to be a PlayerRequestOptions object, but received ${typeof options} instead`);

    const o = module.exports.parseSelectingRequestOptions(options);

    if (options.player === undefined)
        throw new TypeError("'player' has to be defined");
    if (typeof options.player !== "string")
        throw new TypeError("'player' has to be a string");
    if (!(/^[A-Za-z0-9_]{1,16}$/.test(options.player) || module.exports.UUID_PATTERN.test(options.player)))
        throw new TypeError("'player' is not a valid username or UUID")
    o.player = options.player;

    o.forceCaseMatch = false;

    if (options.forceCaseMatch !== undefined && options.forceCaseMatch !== null) {
        if (typeof options.forceCaseMatch !== "boolean")
            throw new TypeError("'forceCaseMatch' has to be a boolean");
        o.forceCaseMatch = options.forceCaseMatch;
    }

    o.forceUUIDLookup = false;

    if (options.forceUUIDLookup !== undefined && options.forceUUIDLookup !== null) {
        if (typeof options.forceUUIDLookup !== "boolean")
            throw new TypeError("'forceUUIDLookup' has to be a boolean");
        o.forceUUIDLookup = options.forceUUIDLookup;
    }

    return o;
}

// parses player options
module.exports.parsePlayerCharacterAbilityTreeRequestOptions = function (options) {
    options ??= {};

    const o = module.exports.parseSelectingRequestOptions(options);

    if (!options.player || typeof options.player !== "string" || !((/^[A-Za-z0-9_]{1,16}$/.test(options.player) || module.exports.UUID_PATTERN.test(options.player))))
        throw new TypeError("'player' has to be a string of a valid username or UUID");
    if (!options.character || typeof options.character !== "string" || !module.exports.UUID_PATTERN.test(options.character))
        throw new TypeError("'character' has to be a string of a UUID");
    if (!options.class || typeof options.class !== "string")
        throw new TypeError("'class' has to be a string");
    o.player = options.player;
    o.character = options.character;
    o.class = module.exports.classBaseType(options.class.toUpperCase().replace("DARK_WIZARD", "DARKWIZARD")).toLowerCase();

    return o;
}

// parses AT options
module.exports.parseOptionsWithClassType = function (options) {
    if (typeof options === "string")
        options = { class: options };

    options ??= {};

    const o = module.exports.parseBaseRequestOptions(options);

    if (!options.class || typeof options.class !== "string")
        throw new TypeError("'class' has to be a string");
    o.class = module.exports.classBaseType(options.class.toUpperCase().replace("DARK_WIZARD", "DARKWIZARD")).toLowerCase();

    return o;
}

// parses player uuid options
module.exports.parsePlayerUUIDRequestOptions = function (options) {
    if (typeof options === "string")
        options = { player: options };

    options ??= {};

    if (typeof options !== "object")
        throw new TypeError(`expected 'options' to be a PlayerRequestOptions object, but received ${typeof options} instead`);

    const o = module.exports.parseBaseRequestOptions(options);

    if (options.player === undefined)
        throw new TypeError("'player' has to be defined");
    if (typeof options.player !== "string")
        throw new TypeError("'player' has to be a string");
    if (!/^[A-Za-z0-9_]{1,16}$/.test(options.player))
        throw new TypeError("'player' is not a valid username")
    o.player = options.player;

    return o;
}

// parses online player options
module.exports.parseOnlinePlayersRequestOptions = function (options) {
    if (typeof options === "string")
        options = { identifier: options };

    options ??= {};

    if (typeof options !== "object")
        throw new TypeError(`expected 'options' to be a OnlinePlayersRequestOptions object, but received ${typeof options} instead`);

    const o = module.exports.parseBaseRequestOptions(options);
    o.identifier = "username";

    if (options.identifier) {
        if (typeof options.identifier !== "string")
            throw new TypeError("'identifier' has to be a string");
        if (!["USERNAME", "UUID"].includes(options.identifier.toUpperCase()))
            throw new TypeError("'identifier' has to be either UUID or USERNAME");
        o.identifier = options.identifier.toLowerCase();
    }

    return o;
}

// parses guild options
module.exports.parseGuildRequestOptions = function (options) {
    if (typeof options === "string")
        options = { guild: options };

    options ??= {};

    if (typeof options !== "object")
        throw new TypeError(`expected 'options' to be a GuildRequestOptions object, but received ${typeof options} instead`);

    const o = module.exports.parseSelectingRequestOptions(options);

    if (options.uuid !== undefined) {
        if (typeof options.uuid !== "string" || !module.exports.UUID_PATTERN.test(options.uuid))
            throw new TypeError("'uuid' has to be a string of a UUID");
        o.path = `uuid/${options.uuid}`;
    } else if (options.guild !== undefined) {
        if (typeof options.guild !== "string")
            throw new TypeError("'guild' has to be a string");
        o.path = options.guild;
    } else if (options.tag) {
        if (typeof options.tag !== "string" || options.tag.length < 3 || options.tag.length > 4)
            throw new TypeError("'tag' has to be a string of length 3 or 4");
        o.path = `prefix/${options.tag}`
    } else {
        throw new TypeError("'uuid', 'guild' or 'tag' has to be defined");
    }

    o.fetchAdditionalStats = false;

    if (options.fetchAdditionalStats !== undefined && options.fetchAdditionalStats !== null) {
        if (typeof options.fetchAdditionalStats !== "boolean")
            throw new TypeError("'fetchAdditionalStats' has to be a boolean");
        o.fetchAdditionalStats = options.fetchAdditionalStats;
    }

    return o;
}

// parses name search options
module.exports.parseNameRequestOptions = function (options) {
    if (typeof options === "string")
        options = { query: options };

    options ??= {};

    if (typeof options !== "object")
        throw new TypeError(`expected 'options' to be a NameSearchRequestOptions object, but received ${typeof options} instead`);

    const o = module.exports.parseBaseRequestOptions(options);

    if (options.query === undefined)
        throw new TypeError("'query' has to be defined");
    if (typeof options.query !== "string" || options.query.length < 3)
        throw new TypeError("'query' has to be a string with a length of at least 3");
    o.query = options.query;

    return o;
}

// parses recipe options
module.exports.parseRecipeRequestOptions = function (options) {
    if (typeof options === "string")
        options = { id: options };

    options ??= {};

    if (typeof options !== "object")
        throw new TypeError(`expected 'options' to be a RecipeSearchRequestOptions object, but received ${typeof options} instead`);

    const armorTypes = ["HELMET", "CHESTPLATE", "LEGGINGS", "BOOTS"];
    const weaponTypes = ["WAND", "SPEAR", "DAGGER", "BOW", "RELIK"];
    const consumableTypes = ["FOOD", "POTION", "SCROLL"];
    const accessoryTypes = ["RING", "BRACELET", "NECKLACE"];
    const armorSkills = ["ARMORING", "TAILORING"];
    const weaponSkills = ["WOODWORKING", "WEAPONSMITHING"];
    const consumableSkills = ["ALCHEMISM", "SCRIBING", "COOKING"];
    const otherSkills = ["JEWELING"];
    const allTypes = armorTypes.concat(weaponTypes).concat(consumableTypes).concat(accessoryTypes);
    const allSkills = armorSkills.concat(weaponSkills).concat(consumableSkills).concat(otherSkills);
    const categories = [
        { name: "ARMOR", types: armorTypes },
        { name: "WEAPON", types: weaponTypes },
        { name: "ACCESSORY", types: accessoryTypes }
    ];

    const o = module.exports.parseBaseRequestOptions(options);

    // verify options

    if (options.id) {
        if (typeof options.id !== "string")
            throw new TypeError("'id' has to be a string");
        if (!/^[A-Za-z]+-([0-9]*[0357]|1)-[0-9]*[3579]$/.test(options.id))
            throw new TypeError("'id' has to be a valid recipe ID");
        const components = options.id.split("-");
        if (!allTypes.includes(components[0].toUpperCase()))
            throw new TypeError("'id' has to be a valid recipe ID");

        o.id = options.id.toUpperCase();
    }

    if (options.type) {
        if (typeof options.type !== "string" || !allTypes.includes(options.type.toUpperCase())) // Type check
            throw new TypeError("'type' has to be a valid RecipeType");

        o.type = options.type.toUpperCase(); // format
    }

    if (options.category) {
        const category = categories.find(v => v.name === options.category?.toUpperCase());
        if (!category)
            throw new TypeError("'category' has to be a valid ItemCategory");

        o.category = options.category.toUpperCase();
    }

    if (options.skill) {
        const skillIndex = allSkills.indexOf(options.skill?.toUpperCase());
        if (skillIndex < 0)
            throw new TypeError("'skill' has to be a valid CraftingSkill");

        o.skill = options.skill.toUpperCase();
    }

    if (options.level) {
        o.level = {
            min: 0,
            max: Number.MAX_SAFE_INTEGER
        };
        if (typeof options.level === "number") {
            if (!Number.isInteger(options.level))
                throw new TypeError("'level' has to be an integer number");
            o.level.min = options.level;
            o.level.max = options.level;
        } else {
            if (!Number.isInteger(options.level.min) && !Number.isInteger(options.level.max))
                throw new TypeError("'level' has to be a valid OpenRange with at least one bound");
            const min = Number.isInteger(options.level.min) ? options.level.min : 0;
            const max = Number.isInteger(options.level.max) ? options.level.max : Number.MAX_SAFE_INTEGER;
            o.level.min = min;
            o.level.max = max;
        }
        // level has no implicit types so no conflict checks
    }

    if (options.health) {
        if (!Number.isInteger(options.health.min) && !Number.isInteger(options.health.max))
            throw new TypeError("'health' has to be a valid OpenRange with at least one bound");
        const min = Number.isInteger(options.health.min) ? options.health.min : 0;
        const max = Number.isInteger(options.health.max) ? options.health.max : Number.MAX_SAFE_INTEGER;

        o.health = {
            min: min,
            max: max
        };
    }

    if (options.damage) {
        if (!Number.isInteger(options.damage.min) && !Number.isInteger(options.damage.max))
            throw new TypeError("'damage' has to be a valid OpenRange with at least one bound");
        const min = Number.isInteger(options.damage.min) ? options.damage.min : 0;
        const max = Number.isInteger(options.damage.max) ? options.damage.max : Number.MAX_SAFE_INTEGER;

        o.damage = {
            min: min,
            max: max
        };
    }

    if (options.durability) {
        if (!Number.isInteger(options.durability.min) && !Number.isInteger(options.durability.max))
            throw new TypeError("'durability' has to be a valid OpenRange with at least one bound");
        const min = Number.isInteger(options.durability.min) ? options.durability.min : 0;
        const max = Number.isInteger(options.durability.max) ? options.durability.max : Number.MAX_SAFE_INTEGER;

        o.durability = {
            min: min,
            max: max
        };
    }

    if (options.duration) {
        if (!Number.isInteger(options.duration.min) && !Number.isInteger(options.duration.max))
            throw new TypeError("'duration' has to be a valid OpenRange with at least one bound");
        const min = Number.isInteger(options.duration.min) ? options.duration.min : 0;
        const max = Number.isInteger(options.duration.max) ? options.duration.max : Number.MAX_SAFE_INTEGER;

        o.duration = {
            min: min,
            max: max
        };
    }

    if (options.basicDuration) {
        if (!Number.isInteger(options.basicDuration.min) && !Number.isInteger(options.basicDuration.max))
            throw new TypeError("'basicDuration' has to be a valid OpenRange with at least one bound");
        const min = Number.isInteger(options.basicDuration.min) ? options.basicDuration.min : 0;
        const max = Number.isInteger(options.basicDuration.max) ? options.basicDuration.max : Number.MAX_SAFE_INTEGER;

        o.basicDuration = {
            min: min,
            max: max
        };
    }

    return o;
}

// parses ingredient options
module.exports.parseIngredientRequestOptions = function (options) {
    if (typeof options === "string")
        options = { displayName: options };

    options ??= {};

    if (typeof options !== "object")
        throw new TypeError(`expected 'options' to be an IngredientSearchRequestOptions object, but received ${typeof options} instead`);

    const armorSkills = ["ARMORING", "TAILORING"];
    const weaponSkills = ["WOODWORKING", "WEAPONSMITHING"];
    const consumableSkills = ["ALCHEMISM", "SCRIBING", "COOKING"];
    const otherSkills = ["JEWELING"];
    const allSkills = armorSkills.concat(weaponSkills).concat(consumableSkills).concat(otherSkills);

    const o = module.exports.parseBaseRequestOptions(options);

    // verify options

    if (options.name) {
        if (typeof options.name !== "string") // Type check
            throw new TypeError("'name' has to be a string");
        o.name = options.name.toUpperCase(); // format
    }

    if (options.displayName) {
        if (typeof options.displayName !== "string")
            throw new TypeError("'displayName' has to be a string");
        o.displayName = options.displayName.toUpperCase();
    }

    if (options.tier) {
        o.tier = {
            min: 0,
            max: 3
        };
        if (typeof options.tier === "number") {
            if (!Number.isInteger(options.tier) || options.tier < 0 || options.tier > 3)
                throw new RangeError("'tier' has to be an integer number between 0 and 3");
            o.tier.min = options.tier;
            o.tier.max = options.tier;
        } else {
            if (!Number.isInteger(options.tier.min) && !Number.isInteger(options.tier.max))
                throw new TypeError("'tier' has to be a valid OpenRange with at least one bound");
            const min = Number.isInteger(options.tier.min) ? options.tier.min : 0;
            const max = Number.isInteger(options.tier.max) ? options.tier.max : 3;
            if (Math.min(min, max) < 0 || Math.max(min, max) > 3)
                throw new RangeError("'tier' has to be within bounds 0 and 3");
            o.tier.min = min;
            o.tier.max = max;
        }
    }

    if (options.level) {
        o.level = {
            min: 0,
            max: Number.MAX_SAFE_INTEGER
        };
        if (typeof options.level === "number") {
            if (!Number.isInteger(options.level))
                throw new TypeError("'level' has to be an integer number");
            o.level.min = options.level;
            o.level.max = options.level;
        } else {
            if (!Number.isInteger(options.level.min) && !Number.isInteger(options.level.max))
                throw new TypeError("'level' has to be a valid OpenRange with at least one bound");
            const min = Number.isInteger(options.level.min) ? options.level.min : 0;
            const max = Number.isInteger(options.level.max) ? options.level.max : Number.MAX_SAFE_INTEGER;
            o.level.min = min;
            o.level.max = max;
        }
    }

    if (options.skills) {
        o.skills = {
            requireAll: options.skills.requireAll ?? true,
            list: []
        };
        if (!Array.isArray(options.skills.list) || !options.skills.list?.every(v => allSkills.includes(v?.toUpperCase())))
            throw new TypeError("'skills.list' has to be an array of valid CraftingSkills");
        o.skills.list = options.skills.list.map(v => v?.toUpperCase())
    }

    if (options.sprite) {
        o.sprite = {
            id: ["number", "string"].includes(typeof options.sprite) ? options.sprite : options.sprite.id,
            damage: options.sprite.damage,
            customModelData: options.sprite.customModelData,
            name: options.sprite.name,
        };
        if (typeof o.sprite.id === "string")
            o.sprite.id = minecraftIds.nums[o.sprite.id];
        if (
            typeof o.sprite.id !== "number" &&
            typeof o.sprite.damage !== "number" &&
            typeof o.sprite.customModelData !== "number" &&
            typeof o.sprite.name !== "string"
        )
            throw new TypeError("'sprite' has to be a valid SpriteQuery or a MinecraftId");
    }

    if (options.identifications) {
        if (Object.getPrototypeOf(options.identifications) !== Object.prototype)
            throw new TypeError("'identifications' has to be a valid IdentificationQuery");

        o.identifications = {
            requireAll: options.identifications.requireAll ?? true,
            list: []
        };
        for (const propName of Object.getOwnPropertyNames(options.identifications)) {
            const prop = options.identifications[propName];
            if (!identificationSpecifiers.includes(propName))
                continue;
            if ((prop.min !== undefined && prop.min !== null && !Number.isInteger(prop.min)) || (prop.max !== undefined && prop.max !== null && !Number.isInteger(prop.max)))
                throw new TypeError(`'${propName}' has to be a valid OpenRange with at least one bound`);

            const idName = module.exports.cctosc(propName);
            let filter = (ingredient) => {
                const id = ingredient.identifications.find(v => v.name === idName);
                return id && (!(id.max < prop.min) || !(id.min > prop.max));
            };
            o.identifications.list.push(filter);
        }
    }

    if (options.restrictedIds) {
        if (Object.getPrototypeOf(options.restrictedIds) !== Object.prototype)
            throw new TypeError("'restrictedIds' has to be a valid RestrictedIdQuery");

        o.restrictedIds = {
            requireAll: options.restrictedIds.requireAll ?? true,
            list: []
        };
        for (const propName of Object.getOwnPropertyNames(options.restrictedIds)) {
            const prop = options.restrictedIds[propName];
            if (!restrictedIdSpecifiers.includes(propName))
                continue;
            if ((prop.min !== undefined && prop.min !== null && !Number.isInteger(prop.min)) || (prop.max !== undefined && prop.max !== null && !Number.isInteger(prop.max)))
                throw new TypeError(`'${propName}' has to be a valid OpenRange with at least one bound`);

            let filter = (ingredient) => {
                const id = ingredient.restrictedIds[propName];
                return id && !(id < prop.min) && !(id > prop.max);
            };
            o.restrictedIds.list.push(filter);
        }
    }

    if (options.positionModifiers) {
        if (Object.getPrototypeOf(options.positionModifiers) !== Object.prototype)
            throw new TypeError("'positionModifiers' has to be a valid PositionModifierQuery");

        o.positionModifiers = {
            requireAll: options.positionModifiers.requireAll ?? true,
            list: []
        };
        for (const propName of Object.getOwnPropertyNames(options.positionModifiers)) {
            const prop = options.positionModifiers[propName];
            if (!positionModifierSpecifiers.includes(propName))
                continue;
            if ((prop.min !== undefined && prop.min !== null && !Number.isInteger(prop.min)) || (prop.max !== undefined && prop.max !== null && !Number.isInteger(prop.max)))
                throw new TypeError(`'${propName}' has to be a valid OpenRange with at least one bound`);

            let filter = (ingredient) => {
                const id = ingredient.positionModifiers[propName];
                return id && !(id < prop.min) && !(id > prop.max);
            };
            o.positionModifiers.list.push(filter);
        }
    }

    return o;
}

// parses item options
module.exports.parseItemRequestOptions = function (options) {
    if (typeof options === "string")
        options = { displayName: options };

    options ??= {};

    if (typeof options !== "object")
        throw new TypeError(`expected 'options' to be an ItemSearchRequestOptions object, but received ${typeof options} instead`);

    const rarities = ["MYTHIC", "FABLED", "LEGENDARY", "RARE", "SET", "UNIQUE", "NORMAL"];
    const dropTypes = ["NEVER", "DUNGEON", "NORMAL", "LOOTCHEST"];
    const restrictions = ["UNTRADABLE", "QUEST"];
    const requirements = [{ key: "level", type: "__custom__:OpenRange" }, { key: "quest", type: "__custom__:CaselessString" }, { key: "class", type: "__custom__:Class" }, { key: "strength", type: "__custom__:OpenRange" }, { key: "dexterity", type: "__custom__:OpenRange" }, { key: "intelligence", type: "__custom__:OpenRange" }, { key: "defence", type: "__custom__:OpenRange" }, { key: "agility", type: "__custom__:OpenRange" }];
    const classes = ["ASSASSIN", "ARCHER", "MAGE", "SHAMAN", "WARRIOR"];
    const attackSpeeds = ["SUPER_SLOW", "VERY_SLOW", "SLOW", "NORMAL", "FAST", "VERY_FAST", "SUPER_FAST"];
    const stats = [{ key: "powderSlots", type: "__custom__:OpenRange" }, { key: "health", type: "__custom__:OpenRange" }, { key: "earthDefence", type: "__custom__:OpenRange" }, { key: "thunderDefence", type: "__custom__:OpenRange" }, { key: "waterDefence", type: "__custom__:OpenRange" }, { key: "fireDefence", type: "__custom__:OpenRange" }, { key: "airDefence", type: "__custom__:OpenRange" }, { key: "damage", type: "__custom__:OpenRangeForRange" }, { key: "earthDamage", type: "__custom__:OpenRangeForRange" }, { key: "thunderDamage", type: "__custom__:OpenRangeForRange" }, { key: "waterDamage", type: "__custom__:OpenRangeForRange" }, { key: "fireDamage", type: "__custom__:OpenRangeForRange" }, { key: "airDamage", type: "__custom__:OpenRangeForRange" }, { key: "attackSpeed", type: "__custom__:AttackSpeedArray" }];
    const armorTypes = ["HELMET", "CHESTPLATE", "LEGGINGS", "BOOTS"];
    const weaponTypes = ["DAGGER", "BOW", "WAND", "SPEAR", "RELIK"];
    const accessoryTypes = ["RING", "BRACELET", "NECKLACE"];
    const allTypes = armorTypes.concat(weaponTypes).concat(accessoryTypes);
    const categories = [
        { name: "ARMOR", types: armorTypes },
        { name: "WEAPON", types: weaponTypes },
        { name: "ACCESSORY", types: accessoryTypes }
    ];

    const o = module.exports.parseBaseRequestOptions(options);

    // Verify options

    if (options.name) {
        if (typeof options.name !== "string") // Type check
            throw new TypeError("'name' has to be a string");

        o.name = options.name.toUpperCase(); // format
    }

    if (options.displayName) {
        if (typeof options.displayName !== "string")
            throw new TypeError("'displayName' has to be a string");

        o.displayName = options.displayName.toUpperCase();
    }

    if (options.type) {
        if (typeof options.type !== "string" || !allTypes.includes(options.type.toUpperCase()))
            throw new TypeError("'type' has to be a valid ItemType");

        o.type = options.type.toUpperCase();
    }

    if (options.tier) {
        if (typeof options.tier !== "string" || !rarities.includes(options.tier.toUpperCase()))
            throw new TypeError("'tier' has to be a valid ItemRarity");

        o.tier = options.tier.toUpperCase();
    }

    if (options.category) {
        const category = categories.find(v => v.name === options.category?.toUpperCase())
        if (!category)
            throw new TypeError("'category' has to be a valid ItemCategory");

        o.category = options.category.toUpperCase();
    }

    if (options.set !== undefined) {
        if (typeof options.set !== "string")
            throw new TypeError("'set' has to be a string");
        o.set = options.set.toUpperCase();
    }

    if (options.sprite) {
        o.sprite = {
            id: ["number", "string"].includes(typeof options.sprite) ? options.sprite : options.sprite.id,
            damage: options.sprite.damage,
            customModelData: options.sprite.customModelData,
            name: options.sprite.name,
        };
        if (typeof o.sprite.id === "string")
            o.sprite.id = minecraftIds.nums[o.sprite.id];
        if (
            typeof o.sprite.id !== "number" &&
            typeof o.sprite.damage !== "number" &&
            typeof o.sprite.customModelData !== "number" &&
            typeof o.sprite.name !== "string"
        )
            throw new TypeError("'sprite' has to be a valid SpriteQuery or a MinecraftId");
    }

    if (options.color) {
        if (!Number.isInteger(options.color[0]) || !Number.isInteger(options.color[1]) || !Number.isInteger(options.color[2]))
            throw new TypeError("'color' has to be a number[] of length 3");
        if (Math.min(options.color[0], options.color[1], options.color[2]) < 0 || Math.max(options.color[0], options.color[1], options.color[2]) > 255)
            throw new RangeError("'color' has to contain only numbers between 0 and 255");

        o.color = options.color;
    }

    if (options.dropType) {
        if (typeof options.dropType !== "string" || !dropTypes.includes(options.dropType.toUpperCase()))
            throw new TypeError("'dropType' has to be a valid ItemDroptype");
        o.dropType = options.dropType.toUpperCase();
    }

    if (options.lore !== undefined) {
        if (typeof options.lore !== "string")
            throw new TypeError("'lore' has to be a string");
        o.lore = options.lore.toUpperCase();
    }

    if (options.restriction !== undefined) {
        if ((options.restriction !== null && typeof options.restriction !== "string") || (options.restriction !== null && !restrictions.includes(options.restriction.toUpperCase())))
            throw new TypeError("'restriction' has to be a valid ItemRestriction");
        o.restriction = options.restriction?.toUpperCase() ?? null;
    }

    if (options.requirements) {
        if (Object.getPrototypeOf(options.requirements) !== Object.prototype)
            throw new TypeError("'requirements' has to be a valid ItemRequirementQuery");

        o.requirements = {
            requireAll: options.requirements.requireAll ?? true,
            list: []
        };
        for (const propName of Object.getOwnPropertyNames(options.requirements)) {
            const req = requirements.find(v => v.key === propName);
            const prop = options.requirements[propName];
            if (!req)
                continue;

            let filter;
            if (req.type.startsWith("__custom__")) { // custom type check
                switch (req.type.slice("__custom__:".length)) {
                    case "Class":
                        if (!classes.includes(prop?.toUpperCase()))
                            throw new TypeError(`'${propName}' has to be a valid ClassType`);
                        filter = (item) => item.requirements[propName] === prop.toUpperCase();
                        break;
                    case "OpenRange":
                        if ((prop.min !== undefined && prop.min !== null && !Number.isInteger(prop.min)) || (prop.max !== undefined && prop.max !== null && !Number.isInteger(prop.max)))
                            throw new TypeError(`'${propName}' has to be a valid OpenRange`);
                        filter = (item) => !(item.requirements[propName] < prop.min) && !(item.requirements[propName] > prop.max);
                        break;
                    case "CaselessString":
                        if (typeof prop !== "string")
                            throw new TypeError(`'${propName}' has to be a string`);
                        filter = (item) => item.requirements[propName]?.toUpperCase() === prop.toUpperCase();
                        break;
                    default:
                        throw new TypeError(`Internal Error: Unknown custom type ${req.type}`);
                }
            } else { // non-custom type check
                if (typeof prop !== req.type)
                    throw new TypeError(`'${prop}' has to be a ${req.type}`);
                filter = (item) => item.requirements[propName] === prop;
            }
            o.requirements.list.push(filter);
        }
    }

    // TODO: update api names of IDs
    if (options.identifications) {
        if (Object.getPrototypeOf(options.identifications) !== Object.prototype)
            throw new TypeError("'identifications' has to be a valid IdentificationQuery");

        o.identifications = {
            requireAll: options.identifications.requireAll ?? true,
            list: []
        };
        for (const propName of Object.getOwnPropertyNames(options.identifications)) {
            const prop = options.identifications[propName];
            if (!identificationSpecifiers.includes(propName))
                continue;
            if ((prop.min !== undefined && prop.min !== null && !Number.isInteger(prop.min)) || (prop.max !== undefined && prop.max !== null && !Number.isInteger(prop.max)))
                throw new TypeError(`'${propName}' has to be a valid OpenRange`);

            const idName = module.exports.cctosc(propName);
            let filter = (item) => {
                const id = item.identifications.find(v => v.name === idName);
                return id && (id.max >= (prop.min ?? Number.NEGATIVE_INFINITY) && (id.min <= (prop.max ?? Number.POSITIVE_INFINITY)));
            };
            o.identifications.list.push(filter);
        }
    }

    if (options.stats) {
        if (Object.getPrototypeOf(options.stats) !== Object.prototype)
            throw new TypeError("'stats' has to be a valid ItemStatsQuery");

        o.stats = {
            requireAll: options.stats.requireAll ?? true,
            list: []
        };
        for (const propName of Object.getOwnPropertyNames(options.stats)) {
            const stat = stats.find(v => v.key === propName);
            const prop = options.stats[propName];
            if (!stat)
                continue;

            let filter;
            if (stat.type.startsWith("__custom__")) { // custom type check
                switch (stat.type.slice(11)) {
                    case "AttackSpeedArray":
                        if (!Array.isArray(prop)) // Is not array
                            throw new TypeError(`'${propName}' has to be an array of AttackSpeeds`);
                        for (const speed of prop) {
                            if (!attackSpeeds.includes(speed?.toUpperCase())) // An element isnt an attack speed
                                throw new TypeError(`'${propName}' has to be an array of AttackSpeeds; ${speed} is not an AttackSpeed`);
                        }
                        const speeds = prop.map(v => v.toUpperCase());
                        filter = (item) => speeds.includes(item.stats[propName]);
                        break;
                    case "OpenRange":
                        if ((prop.min !== undefined && prop.min !== null && !Number.isInteger(prop.min)) || (prop.max !== undefined && prop.max !== null && !Number.isInteger(prop.max)))
                            throw new TypeError(`'${propName}' has to be a valid OpenRange`);
                        filter = (item) => item.stats[propName] >= (prop.min ?? Number.NEGATIVE_INFINITY) && item.stats[propName] <= (prop.max ?? Number.POSITIVE_INFINITY);
                        break;
                    case "OpenRangeForRange":
                        if ((prop.min !== undefined && prop.min !== null && !Number.isInteger(prop.min)) || (prop.max !== undefined && prop.max !== null && !Number.isInteger(prop.max)))
                            throw new TypeError(`'${propName}' has to be a valid OpenRange`);
                        filter = (item) => item.stats[propName] && item.stats[propName].max >= (prop.min ?? Number.NEGATIVE_INFINITY) && item.stats[propName].min <= (prop.max ?? Number.POSITIVE_INFINITY);
                        break;
                    default:
                        throw new TypeError(`Internal Error: Unknown custom type ${stat.type}`);
                }
            } else { // non-custom type check
                if (typeof prop !== stat.type)
                    throw new TypeError(`'${prop}' has to be a ${stat.type}`);
                filter = (item) => item.stats[propName] === prop;
            }
            o.stats.list.push(filter);
        }
    }

    if (options.majorIds) {
        if (Object.getPrototypeOf(options.majorIds) !== Object.prototype)
            throw new TypeError("'majorIds' has to be a valid MajorIdQuery");
        if (!Array.isArray(options.majorIds.list)) // Filter no list object
            throw new TypeError("'majorIds.list' must be an array of MajorIds");

        o.majorIds = {
            requireAll: options.majorIds.requireAll ?? true,
            list: options.majorIds.list.map(v => v.toUpperCase())
        };
    }

    return o;
}

// requests a resource from a JSON API
module.exports.requestJsonApi = async function (route, apiKey = null, attempts = config.defaultRetries + 1, lifetime = config.defaultTimeout) {
    const headers = {};
    if (apiKey)
        headers.apiKey = apiKey;
    let error = null;
    while (attempts--) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), lifetime);
        try {
            const result = await _requestJsonApi(route, headers, controller.signal);
            clearTimeout(timeout);
            return result;
        } catch (e) {
            clearTimeout(timeout);
            error = e;
        }
    }
    throw error;
}

// the excessive try catch spam may seem unneccessary, but none of these event subscriptions have error handlers, if an error is not caught here, it crashes the process
// executes a HTTPS request
function _requestJsonApi(url, headers, signal) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        let measurementTaken = false;
        // console.log("REQUEST", url);
        const req = https.get(url, { headers });
        req.on("error", e => { // kill on error
            try {
                // ping measurement
                if (!measurementTaken) {
                    const now = Date.now();
                    module.exports.pingTimes.push({
                        time: now,
                        value: now - startTime
                    });
                    measurementTaken = true;
                }

                // destroy socket
                req.destroy();
                reject(e);
                return;
            } catch (e) {
                reject(e);
                return;
            }
        });

        req.on("close", () => { // if response was never emited, kill request
            try {
                // ping measurement
                if (!measurementTaken) {
                    const now = Date.now();
                    module.exports.pingTimes.push({
                        time: now,
                        value: now - startTime
                    });
                    measurementTaken = true;
                }

                reject(new Error("No Response received"));
                return;
            } catch (e) {
                reject(e);
                return;
            }
        });
        req.on("response", res => { // fired on initial server response, sets up response processing
            try {
                // ping measurement
                if (!measurementTaken) {
                    const now = Date.now();
                    module.exports.pingTimes.push({
                        time: now,
                        value: now - startTime
                    });
                    measurementTaken = true;
                }

                let text = "";
                const receivedTs = Date.now();

                res.on("data", chunk => {
                    text += chunk;
                });

                res.on("end", () => { // on finished response, stream closes after this
                    try {
                        if (res.headers["content-type"] !== "application/json" && !res.headers["content-type"]?.startsWith("application/json;")) {
                            // console.log("Invalid content type:", res.headers["content-type"])
                            const e = new WynncraftAPIError(`${res.statusCode} ${res.statusMessage}`);
                            e.body = text;
                            reject(e);
                            return;
                        }
                        const result = {
                            status: res.statusCode,
                            headers: res.headers,
                            body: text,
                            requestTimestamp: startTime,
                            responseTimestamp: Number.isNaN(Date.parse(res.headers["date"])) ? Date.now() : Date.parse(res.headers["date"]),
                            receivedTimestamp: receivedTs
                        };
                        resolve(result);
                        return;
                    } catch (e) {
                        reject(e);
                        return;
                    }
                });

                res.on("error", e => { // should only be triggered during a timeout during response transmission
                    reject(e);
                    return;
                });
            } catch (e) {
                reject(e);
                return;
            }
        });
        signal.addEventListener("abort", () => { // timeout
            try {
                // ping measurement
                if (!measurementTaken) {
                    const now = Date.now();
                    module.exports.pingTimes.push({
                        time: now,
                        value: now - startTime
                    });
                    measurementTaken = true;
                }

                req.destroy();
            } catch (e) {
                reject(e);
                return;
            }
            reject(new Error("Request timed out"));
            return;
        });
    });
}

module.exports.checkMultiChoice = async function (obj, statusNum, options, transformer) {
    if (statusNum === 300) {
        const choices = Object.getOwnPropertyNames(obj).map(key => transformer(key, obj[key]));
        if (options.multipleChoicesSelector) {
            let lowestI = choices.length;
            const promises = [];
            for (let i = 0; i < choices.length; i++) {
                const iConst = i;
                const res = options.multipleChoicesSelector(choices[i], i, choices);
                if (res instanceof Promise) {
                    promises.push(res.then(v => v ? lowestI = Math.min(iConst, lowestI) : null));
                } else if (res) {
                    lowestI = i;
                    break;
                }
            }
            if (promises.length)
                await Promise.all(promises);
            const selected = choices[lowestI];
            if (selected)
                return await selected.fetch({ ...options, multipleChoicesSelector: null });
        }
        throw new MultipleChoicesError("Multiple choices match query", choices);
    }
}

// interprets a JSON response from the API
module.exports.interpretApiContent = function (content, data, parsedOptions) {
    // failed legacy request
    if (content.error) {
        throw new WynncraftAPIError(content.error);
    }

    // failed v3 request
    if (content.Error) {
        // Player not found
        if (/^No player found with that (username|UUID)\.$/.test(content.Error))
            return null;
        // Character Ability tree missing, replace with empty tree
        if (["Unable to render this player ability tree as no ability tree was found.", "Character do not have any abilities unlocked."].includes(content.Error))
            return { pages: 0, map: {} };
        // Character not found (first is the equivalent of "Player not found" in /abilities requests)
        if (["Unable to get player characters.", "Given UUID is invalid, please refer to UUIDs listed in '<str:username>/characters'"].includes(content.Error))
            return null;
        // Guild not found
        if (content.Error === "No guild found.")
            return null;
        throw new WynncraftAPIError(content.Error);
    }

    // tried to access a non-existent route
    if (content.status === 404) {
        throw new WynncraftAPIError("Route Not Found");
    }

    // failed v2 request
    if (content.code !== undefined && content.code !== 200) {
        // filter players not found (response status is 400)
        if (content.kind?.startsWith("wynncraft/player/") && content.kind?.endsWith("/stats") && data.status === 400)
            return null;
        // UUID not found
        if (content.kind?.startsWith("wynncraft/player/") && content.kind?.endsWith("/uuid"))
            return null;
        throw new WynncraftAPIError(`${content.code}: ${content.error ?? content.message ?? "Unknown Error"}`);
    }

    // some requests fail with just a message, usually only happens when the API is completely down
    if (content.message) {
        throw new WynncraftAPIError(content.message);
    }

    // reject if version disparity
    if (!parsedOptions.ignoreVersion && parsedOptions.routeVersion) {
        if (parsedOptions.apiVersion === "legacy") {
            if (content.request && (Array.isArray(parsedOptions.routeVersion) ? !parsedOptions.routeVersion.includes(content.request.version) : content.request.version !== parsedOptions.routeVersion))
                throw new WynncraftAPIError(`Version Error: Unable to handle legacy API version ${content.request.version}`);
        } else if (parsedOptions.apiVersion === "v2") {
            if (content.version && (Array.isArray(parsedOptions.routeVersion) ? !parsedOptions.routeVersion.includes(content.version) : content.version !== parsedOptions.routeVersion))
                throw new WynncraftAPIError(`Version Error: Unable to handle v2 or v3 API version ${content.version}`);
        } else if (parsedOptions.apiVersion === "v3") {
            // No v3 version check
        }
    }

    return content;
}

// // returns a random string of given length
// module.exports.randomString = function (length) {
//     const validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-";
//     let final = "";
//     for (let i = 0; i < length; i++) {
//         final += validChars[Math.floor(Math.random() * validChars.length)];
//     }
//     return final;
// }

const bannerPatterns = { // half horizontal mirror
    "STRIPE_BOTTOM": "bs", // Bottom Stripe
    "STRIPE_TOP": "ts", // Top Stripe
    "STRIPE_LEFT": "ls", // Left Stripe
    "STRIPE_RIGHT": "rs", // Right Stripe
    "STRIPE_MIDDLE": "ms", // Middle Stripe
    "STRIPE_CENTER": "cs", // Center Stripe
    "STRIPE_DOWNRIGHT": "drs", // Down Right Stripe
    "STRIPE_DOWNLEFT": "dls", // Down Left Stripe
    "STRIPE_SMALL": "ss", // Small Stripes
    "CROSS": "cr", // Diagonal Cross
    "STRAIGHT_CROSS": "sc", // Square Cross
    "DIAGONAL_LEFT": "ld", // Top Left Triangle
    "DIAGONAL_RIGHT_MIRROR": "rud", // Top Right Triangle
    "DIAGONAL_LEFT_MIRROR": "lud", // Bottom Left Triangle
    "DIAGONAL_RIGHT": "rd", // Bottom Right Triangle
    "HALF_VERTICAL": "vh", // Vertical Half Left
    "HALF_VERTICAL_MIRROR": "vhr", // Vertical Half Right
    "HALF_HORIZONTAL": "hh", // Horizontal Half Top
    "HALF_HORIZONTAL_MIRROR": "hhb", // Horizontal Half Bottom
    "SQUARE_BOTTOM_LEFT": "bl", // Bottom Left Corner
    "SQUARE_BOTTOM_RIGHT": "br", // Bottom Right Corner
    "SQUARE_TOP_LEFT": "tl", // Top Left Corner
    "SQUARE_TOP_RIGHT": "tr", // Top Right Corner
    "TRIANGLE_BOTTOM": "bt", // Bottom Triangle
    "TRIANGLE_TOP": "tt", // Top Triangle
    "TRIANGLES_BOTTOM": "bts", // Bottom Triangle Sawtooth
    "TRIANGLES_TOP": "tts", // Top Triangle Sawtooth
    "CIRCLE_MIDDLE": "mc", // Middle Circle
    "RHOMBUS_MIDDLE": "mr", // Middle Rombus
    "BORDER": "bo", // Border
    "CURLY_BORDER": "cbo", // Curly Border
    "BRICKS": "bri", // Bricks
    "GRADIENT": "gra", // Gradient
    "GRADIENT_UP": "gru", // Gradient Upside-Down
    "CREEPER": "cre", // Creeper
    "SKULL": "sku", // Skull
    "FLOWER": "flo", // Flower
    "MOJANG": "moj", // Mojang Logo
    "GLOBE": "glb", // Globe, not implemented by Wynn
    "PIGLIN": "pig", // Piglin Snoute, not implemented by Wynn
};
// returns the mojang defined pattern id for a given pattern from the Wynn API
module.exports.bannerPattern = function (apiPattern) {
    return bannerPatterns[apiPattern];
}

const colors = {
    "WHITE": "WHITE",
    "SILVER": "LIGHT_GRAY",
    "GRAY": "GRAY",
    "BLACK": "BLACK",
    "LIME": "LIME",
    "GREEN": "GREEN",
    "CYAN": "CYAN",
    "LIGHT_BLUE": "LIGHT_BLUE",
    "BLUE": "BLUE",
    "YELLOW": "YELLOW",
    "ORANGE": "ORANGE",
    "PINK": "PINK",
    "RED": "RED",
    "MAGENTA": "MAGENTA",
    "PURPLE": "PURPLE",
    "BROWN": "BROWN"
};
// returns the standart minecraft color of an api color
module.exports.minecraftColor = function (apiColor) {
    return colors[apiColor];
}

module.exports.sanitizeURL = function (url) {
    return url.split(/\s/).join("%20")
}

// removes the british
module.exports.decolonize = function (word) {
    switch (word) {
        case "ARMOURING":
            return "ARMORING";
        case "ARMOUR":
            return "ARMOR";
        default:
            return word;
    }
}

function sctocc(str) {
    return str.split("").flatMap((v, i, a) => v === "_" ? [] : a[i - 1] === "_" ? [v] : [v.toLowerCase()]).join("");
}
module.exports.sctocc = sctocc;

module.exports.getOrderedDescendingSorter = function (order) {
    switch (order.length) {
        case 4:
            return (a, b) => b[order[0]] - a[order[0]] ||
            ((a[order[1]] !== undefined && b[order[1]] !== undefined) ? b[order[1]] - a[order[1]] : 0) ||
            ((a[order[2]] !== undefined && b[order[2]] !== undefined) ? b[order[2]] - a[order[2]] : 0) ||
            ((a[order[3]] !== undefined && b[order[3]] !== undefined) ? b[order[3]] - a[order[3]] : 0);
        case 3:
            return (a, b) => b[order[0]] - a[order[0]] ||
            ((a[order[1]] !== undefined && b[order[1]] !== undefined) ? b[order[1]] - a[order[1]] : 0) ||
            ((a[order[2]] !== undefined && b[order[2]] !== undefined) ? b[order[2]] - a[order[2]] : 0);
        case 2:
            return (a, b) => b[order[0]] - a[order[0]] ||
            ((a[order[1]] !== undefined && b[order[1]] !== undefined) ? b[order[1]] - a[order[1]] : 0);
        case 1:
            return (a, b) => b[order[0]] - a[order[0]];
        default:
            throw new Error("Order length must be between 1 and 4");
    }
}


// converts lowerCamelCase to UPPER_SNAKE_CASE
module.exports.cctosc = function (str) {
    const arr = [];
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        if (code > 96) {
            arr.push(String.fromCharCode(code - 32));
        } else {
            arr.push("_", String.fromCharCode(code));
        }
    }
    return arr.join("");
}

// converts a decimal version to a SemVer version identifier
module.exports.semVerFromDecimal = function (decimal) {
    return `${Math.floor(decimal)}.${Math.round((decimal * 10) % 10)}.0`;
}

// converts a decimal version to a SemVer version identifier
module.exports.semVerFromHeader = function (str) {
    const groups = /^v(?<major>\d+)(\.(?<minor>\d+))?(\.(?<patch>\d+))?(?<appendix>-.+)?/.exec(str).groups;
    return `${groups.major}.${groups.minor ?? 0}.${groups.patch ?? 0}`; // appendix ommitted
}

// returns the class type of a class skin name
module.exports.classBaseType = function (classSkin) {
    switch (classSkin) {
        case "DARKWIZARD":
        case "MAGE":
            return "MAGE";
        case "NINJA":
        case "ASSASSIN":
            return "ASSASSIN";
        case "HUNTER":
        case "ARCHER":
            return "ARCHER";
        case "KNIGHT":
        case "WARRIOR":
            return "WARRIOR";
        case "SKYSEER":
        case "SHAMAN":
            return "SHAMAN";
        default:
            throw new WynncraftAPIError(`Unknown class skin ${classSkin}`);
    }
};

module.exports.classType = function (classSkin) {
    if (classSkin === "DARKWIZARD")
        return "DARK_WIZARD";
    return classSkin;
}

module.exports.getTerritoryList = function (apiTerritories) {
    const terrs = Object.getOwnPropertyNames(territoryData).filter(v => v !== "_default").map(v => new Territory(territoryData[v], apiTerritories[territoryData[v].name]));
    for (const territoryName of Object.getOwnPropertyNames(apiTerritories)) {
        if (!territoryData[territoryName.toUpperCase()]) {
            terrs.push(new Territory(territoryData._default, apiTerritories[territoryName], territoryName));
        }
    }
    terrs.forEach(terr => {
        terr.connections = terrs.filter(conn => terr.connections.includes(conn.territory));
    });
    return terrs.sort((a, b) => a.territory < b.territory ? -1 : a.territory > b.territory)
}

module.exports.matId2Sprite = function (mat) {
    const parts = mat.split(":");
    return {
        id: minecraftIds.strings[parts[0]],
        numericalId: Number(parts[0]),
        damage: Number(parts[1] ?? 0)
    };
}

module.exports.icon2Sprite = function (icon) {
    if (icon.format !== "attribute")
        throw new Error("icon isn't of type ATTRIBUTE");
    return {
        type: "ATTRIBUTE",
        id: icon.value.id,
        numericalId: minecraftIds.nums[icon.value.id],
        customModelData: Number(icon.value.customModelData),
        name: icon.value.name
    }
}

module.exports.revitalizeRatelimit = function (ratelimit) {
    ratelimit.remaining = ratelimit.limit;
    ratelimit.reset += ratelimit.interval;
}

module.exports.CDN_URL = "https://cdn.wynncraft.com";
module.exports.UUID_PATTERN = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
