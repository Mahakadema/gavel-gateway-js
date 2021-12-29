
const WynncraftAPIError = require("./WynncraftAPIError.js");
const fetch = (url, init) => import('node-fetch').then(({ default: fetch }) => fetch(url, init));
const config = require("./config.js").config;
const minecraftIds = require("../data/minecraftIds.json");
const majorIds = require("../data/majorIds.json");

const identificationSpecifiers = ["strength", "dexterity", "intelligence", "defence", "agility", "mainAttackDamagePercent", "mainAttackDamageRaw", "spellDamagePercent", "spellDamageRaw", "rainbowSpellDamageRaw", "earthDamage", "thunderDamage", "waterDamage", "fireDamage", "airDamage", "earthDefence", "thunderDefence", "waterDefence", "fireDefence", "airDefence", "healthRegenPercent", "healthRegenRaw", "health", "lifeSteal", "manaRegen", "manaSteal", "spellCostPct1", "spellCostRaw1", "spellCostPct2", "spellCostRaw2", "spellCostPct3", "spellCostRaw3", "spellCostPct4", "spellCostRaw4", "attackSpeed", "poison", "thorns", "reflection", "exploding", "jumpHeight", "walkSpeed", "sprintDuration", "sprintRegen", "soulPointRegen", "gatheringSpeed", "gatheringXpBonus", "xpBonus", "lootBonus", "lootQuality", "stealing"];
const restrictedIdSpecifiers = ["durability", "strengthRequirement", "dexterityRequirement", "intelligenceRequirement", "defenceRequirement", "agilityRequirement", "attackSpeed", "powderSlots", "duration", "charges"];
const positionModifierSpecifiers = ["right", "left", "above", "under", "touching", "notTouching"];

/**
 * #####
 * Types
 * #####
 */

/**
 * @typedef {"PLAYER_HEAD"|"LEATHER_HELMET"|"LEATHER_CHESTPLATE"|"LEATHER_LEGGINGS"|"LEATHER_BOOTS"|"GOLDEN_HELMET"|"GOLDEN_CHESTPLATE"|"GOLDEN_LEGGINGS"|"GOLDEN_BOOTS"|"CHAIN_HELMET"|"CHAIN_CHESTPLATE"|"CHAIN_LEGGINGS"|"CHAIN_BOOTS"|"IRON_HELMET"|"IRON_CHESTPLATE"|"IRON_LEGGINGS"|"IRON_BOOTS"|"DIAMOND_HELMET"|"DIAMOND_CHESTPLATE"|"DIAMOND_LEGGINGS"|"DIAMOND_BOOTS"|"WAND_DEFAULT_0"|"WAND_DEFAULT_1"|"WAND_DEFAULT_2"|"WAND_EARTH_0"|"WAND_EARTH_1"|"WAND_EARTH_2"|"WAND_THUNDER_0"|"WAND_THUNDER_1"|"WAND_THUNDER_2"|"WAND_WATER_0"|"WAND_WATER_1"|"WAND_WATER_2"|"WAND_FIRE_0"|"WAND_FIRE_1"|"WAND_FIRE_2"|"WAND_AIR_0"|"WAND_AIR_1"|"WAND_AIR_2"|"WAND_MULTI_0"|"WAND_MULTI_1"|"WAND_MULTI_2"|"SPEAR_DEFAULT_0"|"SPEAR_DEFAULT_1"|"SPEAR_EARTH_0"|"SPEAR_EARTH_1"|"SPEAR_EARTH_2"|"SPEAR_THUNDER_0"|"SPEAR_THUNDER_1"|"SPEAR_THUNDER_2"|"SPEAR_WATER_0"|"SPEAR_WATER_1"|"SPEAR_WATER_2"|"SPEAR_FIRE_0"|"SPEAR_FIRE_1"|"SPEAR_FIRE_2"|"SPEAR_AIR_0"|"SPEAR_AIR_1"|"SPEAR_AIR_2"|"SPEAR_MULTI_0"|"SPEAR_MULTI_1"|"SPEAR_MULTI_2"|"DAGGER_DEFAULT_0"|"DAGGER_DEFAULT_1"|"DAGGER_EARTH_0"|"DAGGER_EARTH_1"|"DAGGER_EARTH_2"|"DAGGER_THUNDER_0"|"DAGGER_THUNDER_1"|"DAGGER_THUNDER_2"|"DAGGER_WATER_0"|"DAGGER_WATER_1"|"DAGGER_WATER_2"|"DAGGER_FIRE_0"|"DAGGER_FIRE_1"|"DAGGER_FIRE_2"|"DAGGER_AIR_0"|"DAGGER_AIR_1"|"DAGGER_AIR_2"|"DAGGER_MULTI_0"|"DAGGER_MULTI_1"|"DAGGER_MULTI_2"|"BOW_DEFAULT_0"|"BOW_DEFAULT_1"|"BOW_EARTH_0"|"BOW_EARTH_1"|"BOW_EARTH_2"|"BOW_THUNDER_0"|"BOW_THUNDER_1"|"BOW_THUNDER_2"|"BOW_WATER_0"|"BOW_WATER_1"|"BOW_WATER_2"|"BOW_FIRE_0"|"BOW_FIRE_1"|"BOW_FIRE_2"|"BOW_AIR_0"|"BOW_AIR_1"|"BOW_AIR_2"|"BOW_MULTI_0"|"BOW_MULTI_1"|"BOW_MULTI_2"|"RELIK_DEFAULT_0"|"RELIK_DEFAULT_1"|"RELIK_EARTH_0"|"RELIK_EARTH_1"|"RELIK_EARTH_2"|"RELIK_THUNDER_0"|"RELIK_THUNDER_1"|"RELIK_THUNDER_2"|"RELIK_WATER_0"|"RELIK_WATER_1"|"RELIK_WATER_2"|"RELIK_FIRE_0"|"RELIK_FIRE_1"|"RELIK_FIRE_2"|"RELIK_AIR_0"|"RELIK_AIR_1"|"RELIK_AIR_2"|"RELIK_MULTI_0"|"RELIK_MULTI_1"|"RELIK_MULTI_2"|"RING_DEFAULT_0"|"RING_DEFAULT_1"|"RING_EARTH_0"|"RING_EARTH_1"|"RING_THUNDER_0"|"RING_THUNDER_1"|"RING_WATER_0"|"RING_WATER_1"|"RING_FIRE_0"|"RING_FIRE_1"|"RING_AIR_0"|"RING_AIR_1"|"RING_MULTI_0"|"RING_MULTI_1"|"RING_SPECIAL_0"|"RING_SPECIAL_1"|"RING_SPECIAL_2"|"BRACELET_DEFAULT_0"|"BRACELET_DEFAULT_1"|"BRACELET_EARTH_0"|"BRACELET_EARTH_1"|"BRACELET_THUNDER_0"|"BRACELET_THUNDER_1"|"BRACELET_WATER_0"|"BRACELET_WATER_1"|"BRACELET_FIRE_0"|"BRACELET_FIRE_1"|"BRACELET_AIR_0"|"BRACELET_AIR_1"|"BRACELET_MULTI_0"|"BRACELET_MULTI_1"|"NECKLACE_DEFAULT_0"|"NECKLACE_DEFAULT_1"|"NECKLACE_EARTH_0"|"NECKLACE_EARTH_1"|"NECKLACE_THUNDER_0"|"NECKLACE_THUNDER_1"|"NECKLACE_WATER_0"|"NECKLACE_WATER_1"|"NECKLACE_FIRE_0"|"NECKLACE_FIRE_1"|"NECKLACE_AIR_0"|"NECKLACE_AIR_1"|"NECKLACE_MULTI_0"|"NECKLACE_MULTI_1"|"NECKLACE_SPECIAL_0"|"NECKLACE_SPECIAL_1"|"NECKLACE_SPECIAL_2"} ItemSpriteName A sprite name commonly used by Wynncraft items
 * @typedef {MinecraftStringId|number} MinecraftId A value resolvable to a minecraft item id
 * @typedef {`minecraft:${string}`} MinecraftStringId A value resolvable to a minecraft item id in string form
 * @typedef {"COMBAT"|"PROFESSION"|"COMBINED"|"MINING"|"WOODCUTTING"|"FARMING"|"FISHING"|"SCRIBING"|"COOKING"|"ALCHEMISM"|"WOODWORKING"|"WEAPONSMITHING"|"TAILORING"|"ARMORING"|"JEWELING"} PlayerSoloLeaderboardType Player leaderboards available for solo
 * @typedef {"PVP"|"COMBAT"|"PROFESSION"|"COMBINED"} PlayerTotalLeaderboardType Player leaderboards available for total
 * @typedef {"TOTAL"|"SOLO"} PlayerLeaderboardScope A scope of leaderboard ranking
 * @typedef {`https://api.wynncraft.com/${string}`|`https://athena.wynntils.com/${string}`} WynncraftAPIRoute A URL to a Wynncraft API resource
 */

/**
 * ##################
 * Generic Interfaces
 * ##################
 */

/**
 * An item sprite
 * @typedef {Object} Sprite
 * @property {MinecraftStringId} id The string version of the items ID
 * @property {number} numericalId The items' numeric ID
 * @property {number} damage The items' damage value (data value)
 */

/**
 * A range containing numbers between certain threshholds, or above/below a
 * threshhold if only one is given; some input fields for OpenRanges may
 * require integers
 * @typedef {Object} OpenRange
 * @property {number} [min] The minimal value to select
 * @property {number} [max] The maximum value to select
 */

/**
 * A range containing numbers between certain threshholds; some input fields
 * for Ranges may require integers
 * @typedef {Object} Range
 * @property {number} min The minimal value to select
 * @property {number} max The maximum value to select
 */

/**
 * ###############
 * Request Helpers
 * ###############
 */

/**
 * A visual sprite to match in ingredient or item search
 * @typedef {Object} SpriteQuery
 * @property {MinecraftId} id The ID of the sprite
 * @property {number} [damage] The damage value (or data value) of the sprite
 */

/**
 * A filter for restricted IDs to match when searching for ingredients
 * @typedef {Object} RestrictedIdQuery
 * @property {boolean} [requireAll=true] Whether all specified filters have to be satisfied, or if any can match
 * @property {OpenRange} [durability] Only match ingredients with a durability modifier within this range
 * @property {OpenRange} [strengthRequirement] Only match ingredients with a strength requirement modifier within this range
 * @property {OpenRange} [dexterityRequirement] Only match ingredients with a dexterity requirement modifier within this range
 * @property {OpenRange} [intelligenceRequirement] Only match ingredients with a intelligence requirement modifier within this range
 * @property {OpenRange} [defenceRequirement] Only match ingredients with a defence requirement modifier within this range
 * @property {OpenRange} [agilityRequirement] Only match ingredients with a agility requirement modifier within this range
 * @property {OpenRange} [attackSpeed] Only match ingredients with an attack speed modifier within this range
 * @property {OpenRange} [powderSlots] Only match ingredients with a powder slot modifier within this range
 * @property {OpenRange} [duration] Only match ingredients with a duration modifier within this range
 * @property {OpenRange} [charges] Only match ingredients with a charges modifier within this range
 */

/**
 * A stat filter to match when requesting items
 * @typedef {Object} ItemStatQuery
 * @property {boolean} [requireAll=true] Whether all specified filters have to be satisfied, or if any can match
 * @property {OpenRange} [powderSlots] Only match items with Powder Slots within this range
 * @property {OpenRange} [health] Only match items with Health within this range
 * @property {OpenRange} [earthDefence] Only match items with Earth Defence within this range
 * @property {OpenRange} [thunderDefence] Only match items with Thunder Defence within this range
 * @property {OpenRange} [waterDefence] Only match items with Water Defence within this range
 * @property {OpenRange} [fireDefence] Only match items with Fire Defence within this range
 * @property {OpenRange} [airDefence] Only match items with Air Defence within this range
 * @property {OpenRange} [damage] Only match items with Neutral Damage within this range
 * @property {OpenRange} [earthDamage] Only match items with Earth Damage within this range
 * @property {OpenRange} [thunderDamage] Only match items with Thunder Damage within this range
 * @property {OpenRange} [waterDamage] Only match items with Water Damage within this range
 * @property {OpenRange} [fireDamage] Only match items with Fire Damage within this range
 * @property {OpenRange} [airDamage] Only match items with Air Damage within this range
 * @property {import("./models/Item").AttackSpeed[]} [attackSpeed] Only match items with Attack Speeds matching one these
 */

/**
 * A major ID filter to match when requesting Items
 * @typedef {Object} MajorIdQuery
 * @property {boolean} [requireAll=true] Whether the item has to have all major IDs, or if any are sufficient
 * @property {import("./models/Item").MajorId[]} list A list of Major IDs to look for
 */

/**
 * A requirement filter to match when requesting items
 * @typedef {Object} ItemRequirementQuery
 * @property {boolean} [requireAll=true] Whether all specified filters have to be satisfied, or if any can match
 * @property {OpenRange} [level] The level to match
 * @property {string} [quest] Only matches items with this quest requirement; case-insensitive
 * @property {import("./models/Player").ClassType} [class] Only match items with this class requirement
 * @property {OpenRange} [strength] Only match items with a Strength req within this range
 * @property {OpenRange} [dexterity] Only match items with a Dexterity req within this range
 * @property {OpenRange} [intelligence] Only match items with a Intelligence req within this range
 * @property {OpenRange} [defence] Only match items with a Defence req within this range
 * @property {OpenRange} [agility] Only match items with a Agility req within this range
 */

/**
 * A position modifier filter to match when requesting ingredients
 * @typedef {Object} PositionModifierQuery
 * @property {boolean} [requireAll=true] Whether all specified filters have to be satisfied, or if any can match
 * @property {OpenRange} [left] A range the Left modifier has to be within
 * @property {OpenRange} [right] A range the Right modifier has to be within
 * @property {OpenRange} [above] A range the Above modifier has to be within
 * @property {OpenRange} [under] A range the Under modifier has to be within
 * @property {OpenRange} [touching] A range the Touching modifier has to be within
 * @property {OpenRange} [notTouching] A range the Not Touching modifier has to be within
 */

/**
 * A crafting profession filter to match when requesting ingredients
 * @typedef {Object} CraftingSkillQuery
 * @property {boolean} [requireAll=true] Whether the ingredient has to be usable for all specified Crafting Skills, or if any are sufficient
 * @property {import("./models/Recipe").CraftingSkill[]} list A list of Crafting Skills to look for
 */

/**
 * An ID filter to match when requesting items or ingredients
 * @typedef {Object} IdentificationQuery
 * @property {boolean} [requireAll=true] Whether all specified filters have to be satisfied, or if any can match
 * @property {OpenRange} [strength] The Strength identification has to have possible values within this range
 * @property {OpenRange} [dexterity] The Dexterity identification has to have possible values within this range
 * @property {OpenRange} [intelligence] The Intelligence identification has to have possible values within this range
 * @property {OpenRange} [defence] The Defence identification has to have possible values within this range
 * @property {OpenRange} [agility] The Agility identification has to have possible values within this range
 * @property {OpenRange} [mainAttackDamagePercent] The Main Attack Damage % identification has to have possible values within this range
 * @property {OpenRange} [mainAttackDamageRaw] The Raw Main Attack Damage identification has to have possible values within this range
 * @property {OpenRange} [spellDamagePercent] The Spell Damage % identification has to have possible values within this range
 * @property {OpenRange} [spellDamageRaw] The Raw Spell Damage identification has to have possible values within this range
 * @property {OpenRange} [rainbowSpellDamageRaw] The Raw Rainbow Spell Damage identification has to have possible values within this range
 * @property {OpenRange} [earthDamage] The Earth Damage % identification has to have possible values within this range
 * @property {OpenRange} [thunderDamage] The Thunder Damage % identification has to have possible values within this range
 * @property {OpenRange} [waterDamage] The Water Damage % identification has to have possible values within this range
 * @property {OpenRange} [fireDamage] The Fire Damage % identification has to have possible values within this range
 * @property {OpenRange} [airDamage] The Air Damage % identification has to have possible values within this range
 * @property {OpenRange} [earthDefence] The Earth Defence % identification has to have possible values within this range
 * @property {OpenRange} [thunderDefence] The Thunder Defence % identification has to have possible values within this range
 * @property {OpenRange} [waterDefence] The Water Defence % identification has to have possible values within this range
 * @property {OpenRange} [fireDefence] The Fire Defence % identification has to have possible values within this range
 * @property {OpenRange} [airDefence] The Air Defence % identification has to have possible values within this range
 * @property {OpenRange} [healthRegenPercent] The Health Regen % identification has to have possible values within this range
 * @property {OpenRange} [healthRegenRaw] The Raw Health Regen identification has to have possible values within this range
 * @property {OpenRange} [health] The Health identification has to have possible values within this range
 * @property {OpenRange} [lifeSteal] The Life Steal identification has to have possible values within this range
 * @property {OpenRange} [manaRegen] The Mana Regen identification has to have possible values within this range
 * @property {OpenRange} [manaSteal] The Mana Steal identification has to have possible values within this range
 * @property {OpenRange} [spellCostPct1] The 1st Spell Cost % identification has to have possible values within this range
 * @property {OpenRange} [spellCostRaw1] The 1st Raw Spell Cost identification has to have possible values within this range
 * @property {OpenRange} [spellCostPct2] The 2nd Spell Cost % identification has to have possible values within this range
 * @property {OpenRange} [spellCostRaw2] The 2nd Raw Spell Cost identification has to have possible values within this range
 * @property {OpenRange} [spellCostPct3] The 3rd Spell Cost % identification has to have possible values within this range
 * @property {OpenRange} [spellCostRaw3] The 3rd Raw Spell Cost identification has to have possible values within this range
 * @property {OpenRange} [spellCostPct4] The 4th Spell Cost % identification has to have possible values within this range
 * @property {OpenRange} [spellCostRaw4] The 4th Raw Spell Cost identification has to have possible values within this range
 * @property {OpenRange} [attackSpeed] The Attack Speed identification has to have possible values within this range
 * @property {OpenRange} [poison] The Poison identification has to have possible values within this range
 * @property {OpenRange} [thorns] The Thorns identification has to have possible values within this range
 * @property {OpenRange} [reflection] The Reflection identification has to have possible values within this range
 * @property {OpenRange} [exploding] The Exploding identification has to have possible values within this range
 * @property {OpenRange} [jumpHeight] The Jump Height identification has to have possible values within this range
 * @property {OpenRange} [walkSpeed] The Walk Speed identification has to have possible values within this range
 * @property {OpenRange} [sprintDuration] The Sprint Duration identification has to have possible values within this range
 * @property {OpenRange} [sprintRegen] The Sprint Regen identification has to have possible values within this range
 * @property {OpenRange} [soulPointRegen] The Soul Point Regen identification has to have possible values within this range
 * @property {OpenRange} [gatheringSpeed] The Gathering Speed identification has to have possible values within this range
 * @property {OpenRange} [gatheringXpBonus] The Gathering XP Bonus identification has to have possible values within this range
 * @property {OpenRange} [xpBonus] The XP Bonus identification has to have possible values within this range
 * @property {OpenRange} [lootBonus] The Loot Bonus identification has to have possible values within this range
 * @property {OpenRange} [lootQuality] The Loot Quality identification has to have possible values within this range
 * @property {OpenRange} [stealing] The Stealing identification has to have possible values within this range
 */

/**
 * ###############
 * Request Options
 * ###############
 */

/**
 * The options for an item API request
 * @typedef {RequestOptions} ItemSearchRequestOptions
 * @property {string} [name] Only match items containing this string in their `name`; case-insensitive; use the displayName filter for names as shown in-game
 * @property {string} [displayName] Only match items containing this string in their `displayName`; case-insensitive
 * @property {import("./models/Item").ItemRarity} [tier] Only match items of this Rarity
 * @property {import("./models/Item").ItemType} [type] Only match items of this type
 * @property {import("./models/Item").ItemCategory} [category] Only match items of this category
 * @property {string} [set] Only match items that are part of this set; set is currently only used by the `LEAF` set
 * @property {SpriteQuery|MinecraftId} [sprite] Only match items using this visual sprite
 * @property {number[]} [color] Only match items using this color; the array has to have a length of 3; the numbers must be between 0 and 255
 * @property {import("./models/Item").ItemDropType} [dropType] Only match items obtained from this source
 * @property {string} [lore] Only match items containing this string in their lore; case-insensitive
 * @property {import("./models/Item").ItemRestriction} [restriction] Only match items with this restriction
 * @property {ItemRequirementQuery} [requirements] Only match items that match the requirement query; values in ranges must be integer
 * @property {IdentificationQuery} [identifications] Only match items that match the identification query; values in ranges must be integer; to search for an ID with any value range, use an empty Range `{}`
 * @property {ItemStatQuery} [stats] Only match items that match the stat query; values in ranges must be integer
 * @property {MajorIdQuery} [majorIds] Only match items that match the major ID query
 */

/**
 * The options for a recipe API request
 * @typedef {RequestOptions} RecipeSearchRequestOptions
 * @property {string} [id] Only match the recipe with this ID
 * @property {OpenRange|number} [level] Only match recipes within this level range; Values have to be integer; The Range has to have at least one bound
 * @property {import("./models/Recipe").CraftableItemType} [type] Only match recipes of this item type
 * @property {import("./models/Item").ItemCategory} [category] Only match recipes of this item category
 * @property {import("./models/Recipe").CraftingSkill} [skill] Only match recipes using this crafting skill
 * @property {OpenRange} [durability] Only match recipes if their durability lies within this range; Values have to be integer; The Range has to have at least one bound
 * @property {OpenRange} [duration] Only match recipes if their duration lies within this range; Values have to be integer; The Range has to have at least one bound
 * @property {OpenRange} [basicDuration] Only match recipes if their basic duration lies within this range; Values have to be integer; The Range has to have at least one bound
 * @property {OpenRange} [health] Only match recipes if their health lies within this range; Values have to be integer; The Range has to have at least one bound
 * @property {OpenRange} [damage] Only match recipes if their damage lies within this range; Values have to be integer; The Range has to have at least one bound
 */

/**
 * The options for an ingredient API request
 * @typedef {RequestOptions} IngredientSearchRequestOptions
 * @property {string} [name] Only match ingredients containing this string in their name; case-insensitive
 * @property {string} [displayName] Only match ingredients containing this string in their name as displayed in-game; case-insensitive
 * @property {OpenRange|number} [tier] Only match ingredients of this tier; Values have to be integer and between 0 and 3; The Range has to have at least one bound
 * @property {OpenRange|number} [level] Only match ingredients of this level; Values have to be integer; The Range has to have at least one bound
 * @property {CraftingSkillQuery} [skills] Only match ingredients that match this Filter
 * @property {SpriteQuery|MinecraftId} [sprite] Only match ingredients using this sprite
 * @property {IdentificationQuery} [identifications] Only match ingredients with these identifications; Values for ID bounds have to be integer
 * @property {RestrictedIdQuery} [restrictedIds] Only match ingredients with these restricted identifications; Values for ID bounds have to be integer
 * @property {PositionModifierQuery} [positionModifiers] Only match ingredients with these positional modifiers; Values for Modifier bounds have to be integer
 */

/**
 * The options for a guild API request
 * @typedef {RequestOptions} GuildRequestOptions
 * @property {string} guild The name of the guild
 * @property {boolean} [fetchAdditionalStats=false] Whether to display more precise and additional information, may cause extra API requests
 */

/**
 * The options for a player leaderboard API request
 * @typedef {RequestOptions} PlayerLeaderboardRequestOptions
 * @property {PlayerLeaderboardScope} [scope="TOTAL"] The scope of the leaderboard; whether to rank by level of a single class or across all classes
 * @property {PlayerSoloLeaderboardType|PlayerTotalLeaderboardType} [type] The type of level or levels to rank Only use Solo types if the solo scope is selected and vice versa
 */

/**
 * The options for a player API request
 * @typedef {RequestOptions} PlayerRequestOptions
 * @property {string} player A player UUID or name
 */

/**
 * The options for a raw API request
 * @typedef {RequestOptions} RawRequestOptions
 * @property {WynncraftAPIRoute} route The API route to request
 * @property {boolean} [allowStacking] Whether requests to the same route should be allowed to be stacked; stacked requests only use a single API request and return the EXACT same object as all other requests in the stack; KEEPING THIS ENABLED CAN CAUSE ERRORS IF REQUESTED DATA IS MUTATED IN DOWNSTREAM CODE
 * @property {boolean} [interpret=true] Whether errors or profiles not being found should be filtered out and throw errors/return null
 */

/**
 * The base options for a generic API request
 * @typedef {Object} RequestOptions
 * @property {string} [apiKey] The API key to use in this request; the key has to be  registered in the config; if this is not given, the registered key with the most free requests will be selected
 * @property {boolean} [allowCache] Whether to allow this request to pull from cache if possible
 * @property {boolean} [priority=false] Whether this request should be put to the front of the queue, executing before any non-priority requests are handled
 * @property {number} [retries] The amount of times to retry the request on error
 * @property {number} [timeout] The amount of milliseconds a until the request should be rejected
 * @property {number} [cacheFor=30000] The amount of time the request should be cached for; default is overridden by config unless `fetchRaw()` is used
 * @property {boolean} [ignoreVersion=false] Whether to ignore version errors; only use this to resolve temporary conflicts while the library awaits being updated
 */

/**
 * #########
 * Ratelimit
 * #########
 */

/**
 * A Ratelimit channel has has a private ratelimit that is unaffected by
 * other calls to the API; only calls using the `apiKey` of the channel
 * affect the ratelimit; if no API keys are set in the config, only one
 * channel exists with the `apiKey` being set to `null`
 * @typedef {Object} RatelimitChannel
 * @property {string} apiKey The API key being used with this channel
 * @property {number} total The limit the channel gets reset to upon reset
 * @property {number} remaining Requests remaining on this channel
 * @property {number} reset Amount of milliseconds until this channels' remaining requests are reset to the limit
 * @property {number} queued The amount of requests currently queued to be processed using this key
 */

/**
 * Information on the ratelimits of the API
 * @typedef {Object} Ratelimit
 * @property {number} apiKeys The amount of API keys currently registered in the config
 * @property {RatelimitChannel[]} channels The ratelimit data per channel used
 * @property {number} totalOngoing The amount of requests currently being processed
 * @property {number} totalQueued The amount of requests currently awaiting to be processed
 */

/**
 * ##########
 * Local Data
 * ##########
 */

/**
 * Information on guild level requirements
 * @typedef {Object} GuildLevelRequirementData
 * @property {number} preGavelReborn The amount of XP required to level to the next level before 1.20 - Gavel Reborn; values above lvl 87 are only approximations
 * @property {number} postGavelReborn The amount of XP required to level to the next level after 1.20 - Gavel Reborn
 */

/**
 * A table to translate Minecraft ID strings to numeric IDs and back; only
 * item IDs
 * @typedef {Object} MinecraftIds
 * @property {Map<MinecraftStringId, number>} nums An object with key value pairs mapping string IDs -> numeric IDs
 * @property {Map<number, MinecraftStringId>} strings An object with key value pairs mapping numeric IDs -> string IDs
 */

/**
 * Additional information for a territory
 * @typedef {Object} TerritoryData
 * @property {string} name The name of the territory
 * @property {import("./models/Territory").Resources} resources The resource production of the territory
 * @property {string[]} connections The names of the territories with a trade route to this territory
 */

/**
 * Table to translate raw major ID API data to wrapped data
 * @typedef {Object} MajorIdData
 * @property {import("./models/Item").MajorId} name The Major ID name the wrapper uses
 * @property {string} apiName The name of the Major ID in the API
 * @property {string} [inGameName] The name of the Major ID as it shows up in-game; only set after items have been requested once
 * @property {string} [description] The description of the Major ID as it shows up in-game; only set after items have been requested once
 */

/**
 * Information to translate raw identification API data to wrapped data
 * @typedef {Object} IdentificationData
 * @property {import("./models/Item").IdentificationName} name The name the wrapper uses
 * @property {string} itemApiName The name used in the item API
 * @property {string} ingredientApiName The name used in the ingredient API
 * @property {boolean} static Whether the ID has a static value
 */

/**
 * A collection of static data that is used within the library, but can also be used externally
 * @typedef {Object} LocalData
 * @property {IdentificationData[]} identifications Information on Identifications
 * @property {MajorIdData[]} majorIds Information on Major ID names that are spelled differently in the wrapper than in the API
 * @property {MinecraftIds} minecraftIds A translation table for string and numeric minecraft IDs
 * @property {Map<string, TerritoryData>} territories Information on Territories
 * @property {Map<ItemSpriteName, Sprite>} sprites Information on sprites commonly used by wynncraft items; not all sprites are listed here, namely any ingredients along with some special weapons, currently only `Wybel Paw`
 * @property {GuildLevelRequirementData[]} guildlevels Information on guild level requirements; the preGavelReborn is the value for a guild to level up from the given level to the next, prior to 1.20; postGavelReborn is it's equivalent for post 1.20; this data can be used to interpret the xp percentage returned by the guild API; the index indicates the level for this requirement
 */

// throws the exception while moving context to here
module.exports.throwErr = function (error) {
    if (error instanceof WynncraftAPIError)
        throw new WynncraftAPIError(error.message);
    if (error instanceof TypeError)
        throw new TypeError(error.message);
    if (error instanceof RangeError)
        throw new RangeError(error.message);
    if (error instanceof EvalError)
        throw new EvalError(error.message);
    if (error instanceof ReferenceError)
        throw new ReferenceError(error.message);
    if (error instanceof SyntaxError)
        throw new SyntaxError(error.message);
    if (error instanceof URIError)
        throw new URIError(error.message);

    if (error?.message)
        throw new Error(error.message);

    throw new Error(error);

    throw error;
}

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
        obj.retries = options.retries;
    }
    if (options.hasOwnProperty("timeout")) {
        if (!Number.isInteger(options.timeout))
            throw new TypeError("'timeout' must be an integer number of milliseconds");
        obj.timeout = options.timeout;
    }
    if (options.hasOwnProperty("cacheFor")) {
        if (!Number.isInteger(options.cacheFor))
            throw new TypeError("'cacheFor' must be an integer number of milliseconds");
        obj.cacheFor = options.cacheFor;
    }
    if (options.hasOwnProperty("ignoreVersion")) {
        if (typeof options.ignoreVersion !== "boolean")
            throw new TypeError("'ignoreVersion' must be an integer number of milliseconds");
        obj.ignoreVersion = options.ignoreVersion;
    }

    return obj;
}

// parses fetchRaw options
module.exports.parseRawRequestOptions = function (options) {
    if (typeof options === "string")
        options = { route: options };

    options ??= {};

    if (typeof options !== "object")
        throw new TypeError(`expected 'options' to be a RequestOptions object, but received ${typeof options} instead`);

    const o = module.exports.parseBaseRequestOptions(options);
    o.allowStacking = config.allowStackingByDefault;
    o.interpret = true;
    o.cacheFor ??= 30000;

    if (options.route === undefined)
        throw new TypeError("'route' has to be defined");
    if (typeof options.route !== "string")
        throw new TypeError("'route' must be a URL string");
    if (!/^(https:\/\/|http:\/\/)?(api.wynncraft.com|athena.wynntils.com)\//.test(options.route))
        throw new URIError("URL in 'route' does not refer to the Wynncraft API");
    o.route = module.exports.sanitizeURL(options.route);

    if (options.hasOwnProperty("allowStacking")) {
        if (typeof options.allowStacking !== "boolean")
            throw new TypeError("'allowStacking' must be a boolean");
        o.allowStacking = options.allowStacking;
    }

    if (options.hasOwnProperty("interpret")) {
        if (typeof options.interpret !== "boolean")
            throw new TypeError("'interpret' must be a boolean");
        o.interpret = options.interpret;
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
        throw new TypeError(`expected 'options' to be a RequestOptions object, but received ${typeof options} instead`);

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

// parses player options
module.exports.parsePlayerRequestOptions = function (options) {
    if (typeof options === "string")
        options = { player: options };

    options ??= {};

    if (typeof options !== "object")
        throw new TypeError(`expected 'options' to be a RequestOptions object, but received ${typeof options} instead`);

    const o = module.exports.parseBaseRequestOptions(options);

    if (options.player === undefined)
        throw new TypeError("'player' has to be defined");
    if (typeof options.player !== "string")
        throw new TypeError("'player' has to be a string");
    o.player = options.player;

    return o;
}

// parses guild options
module.exports.parseGuildRequestOptions = function (options) {
    if (typeof options === "string")
        options = { guild: options };

    options ??= {};

    if (typeof options !== "object")
        throw new TypeError(`expected 'options' to be a RequestOptions object, but received ${typeof options} instead`);

    const o = module.exports.parseBaseRequestOptions(options);

    if (options.guild === undefined)
        throw new TypeError("'guild' has to be defined");
    if (typeof options.guild !== "string")
        throw new TypeError("'guild' has to be a string");
    o.guild = options.guild;

    o.fetchAdditionalStats = false;

    if (options.fetchAdditionalStats !== undefined && options.fetchAdditionalStats !== null) {
        if (typeof options.fetchAdditionalStats !== "boolean")
            throw new TypeError("'fetchAdditionalStats' has to be a boolean");
        o.fetchAdditionalStats = options.fetchAdditionalStats;
    }

    return o;
}

// parses recipe options
module.exports.parseRecipeRequestOptions = function (options) {
    if (typeof options === "string")
        options = { id: options };

    options ??= {};

    if (typeof options !== "object")
        throw new TypeError(`expected 'options' to be a RequestOptions object, but received ${typeof options} instead`);

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

    // semantics checks init
    const disallowedTypes = new Map();

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

        for (const t of allTypes.filter(v => v !== components[0].toUpperCase())) {
            disallowedTypes.set(t, true);
        }
    }

    if (options.type) {
        if (typeof options.type !== "string" || !allTypes.includes(options.type.toUpperCase())) // Type check
            throw new TypeError("'type' has to be a valid RecipeType");

        if (disallowedTypes.has(options.type.toUpperCase())) // conflict check
            return { hasConflict: true };

        o.type = options.type.toUpperCase(); // format

        for (const t of allTypes.filter(v => v !== o.type)) { // update conflict list
            disallowedTypes.set(t, true);
        }
    }

    if (options.category) {
        const category = categories.find(v => v.name === options.category?.toUpperCase());
        if (!category)
            throw new TypeError("'category' has to be a valid ItemCategory");

        if (category.types.every(v => disallowedTypes.has(v)))
            return { hasConflict: true };

        o.category = options.category.toUpperCase();

        for (const t of allTypes.filter(v => !category.types.includes(v))) {
            disallowedTypes.set(t, true);
        }
    }

    if (options.skill) {
        const skillIndex = allSkills.indexOf(options.skill?.toUpperCase());
        if (skillIndex < 0)
            throw new TypeError("'skill' has to be a valid CraftingSkill");

        if (disallowedTypes.has(allTypes[skillIndex]))
            return { hasConflict: true };

        o.skill = options.skill.toUpperCase();

        for (const t of allTypes.filter(v => v !== allTypes[skillIndex])) {
            disallowedTypes.set(t, true);
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
        // level has no implicit types so no conflict checks
    }

    if (options.health) {
        if (!Number.isInteger(options.health.min) && !Number.isInteger(options.health.max))
            throw new TypeError("'health' has to be a valid OpenRange with at least one bound");
        const min = Number.isInteger(options.health.min) ? options.health.min : 0;
        const max = Number.isInteger(options.health.max) ? options.health.max : Number.MAX_SAFE_INTEGER;

        if (armorTypes.every(v => disallowedTypes.has(v)))
            return { hasConflict: true };

        o.health = {
            min: min,
            max: max
        };

        for (const t of weaponTypes.concat(consumableTypes).concat(accessoryTypes)) {
            disallowedTypes.set(t, true);
        }
    }

    if (options.damage) {
        if (!Number.isInteger(options.damage.min) && !Number.isInteger(options.damage.max))
            throw new TypeError("'damage' has to be a valid OpenRange with at least one bound");
        const min = Number.isInteger(options.damage.min) ? options.damage.min : 0;
        const max = Number.isInteger(options.damage.max) ? options.damage.max : Number.MAX_SAFE_INTEGER;

        if (weaponTypes.every(v => disallowedTypes.has(v)))
            return { hasConflict: true };

        o.damage = {
            min: min,
            max: max
        };

        for (const t of armorTypes.concat(consumableTypes).concat(accessoryTypes)) {
            disallowedTypes.set(t, true);
        }
    }

    if (options.durability) {
        if (!Number.isInteger(options.durability.min) && !Number.isInteger(options.durability.max))
            throw new TypeError("'durability' has to be a valid OpenRange with at least one bound");
        const min = Number.isInteger(options.durability.min) ? options.durability.min : 0;
        const max = Number.isInteger(options.durability.max) ? options.durability.max : Number.MAX_SAFE_INTEGER;

        if (weaponTypes.concat(armorTypes).concat(accessoryTypes).every(v => disallowedTypes.has(v)))
            return { hasConflict: true };

        o.durability = {
            min: min,
            max: max
        };

        for (const t of consumableTypes) {
            disallowedTypes.set(t, true);
        }
    }

    if (options.duration) {
        if (!Number.isInteger(options.duration.min) && !Number.isInteger(options.duration.max))
            throw new TypeError("'duration' has to be a valid OpenRange with at least one bound");
        const min = Number.isInteger(options.duration.min) ? options.duration.min : 0;
        const max = Number.isInteger(options.duration.max) ? options.duration.max : Number.MAX_SAFE_INTEGER;

        if (consumableTypes.every(v => disallowedTypes.has(v)))
            return { hasConflict: true };

        o.duration = {
            min: min,
            max: max
        };

        for (const t of weaponTypes.concat(armorTypes).concat(accessoryTypes)) {
            disallowedTypes.set(t, true);
        }
    }

    if (options.basicDuration) {
        if (!Number.isInteger(options.basicDuration.min) && !Number.isInteger(options.basicDuration.max))
            throw new TypeError("'basicDuration' has to be a valid OpenRange with at least one bound");
        const min = Number.isInteger(options.basicDuration.min) ? options.basicDuration.min : 0;
        const max = Number.isInteger(options.basicDuration.max) ? options.basicDuration.max : Number.MAX_SAFE_INTEGER;

        if (consumableTypes.every(v => disallowedTypes.has(v)))
            return { hasConflict: true };

        o.basicDuration = {
            min: min,
            max: max
        };

        for (const t of weaponTypes.concat(armorTypes).concat(accessoryTypes)) {
            disallowedTypes.set(t, true);
        }
    }

    return o;
}

// parses ingredient options
module.exports.parseIngredientRequestOptions = function (options) {
    if (typeof options === "string")
        options = { displayName: options };

    options ??= {};

    if (typeof options !== "object")
        throw new TypeError(`expected 'options' to be a RequestOptions object, but received ${typeof options} instead`);

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
            damage: options.sprite.damage
        };
        if (typeof o.sprite.id === "string")
            o.sprite.id = minecraftIds.nums[o.sprite.id];
        if (typeof o.sprite.id !== "number")
            throw new TypeError("'sprite' has to be a valid SpriteQuery or a MinecraftId");
    }

    if (options.identifications) {
        if (Object.getPrototypeOf(options.identifications) === Object.prototype) {
            o.identifications = {
                requireAll: options.identifications.requireAll ?? true,
                list: []
            };
            for (const propName in options.identifications) {
                const prop = options.identifications[propName];
                if (options.identifications.hasOwnProperty(propName) && identificationSpecifiers.includes(propName)) {
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
        } else {
            throw new TypeError("'identifications' has to be a valid IdentificationQuery");
        }
    }

    if (options.restrictedIds) {
        if (Object.getPrototypeOf(options.restrictedIds) === Object.prototype) {
            o.restrictedIds = {
                requireAll: options.restrictedIds.requireAll ?? true,
                list: []
            };
            for (const propName in options.restrictedIds) {
                const prop = options.restrictedIds[propName];
                if (options.restrictedIds.hasOwnProperty(propName) && restrictedIdSpecifiers.includes(propName)) {
                    if ((prop.min !== undefined && prop.min !== null && !Number.isInteger(prop.min)) || (prop.max !== undefined && prop.max !== null && !Number.isInteger(prop.max)))
                        throw new TypeError(`'${propName}' has to be a valid OpenRange with at least one bound`);
                    let filter = (ingredient) => {
                        const id = ingredient.restrictedIds[propName];
                        return id && !(id < prop.min) && !(id > prop.max);
                    };
                    o.restrictedIds.list.push(filter);
                }
            }
        } else {
            throw new TypeError("'restrictedIds' has to be a valid RestrictedIdQuery");
        }
    }

    if (options.positionModifiers) {
        if (Object.getPrototypeOf(options.positionModifiers) === Object.prototype) {
            o.positionModifiers = {
                requireAll: options.positionModifiers.requireAll ?? true,
                list: []
            };
            for (const propName in options.positionModifiers) {
                const prop = options.positionModifiers[propName];
                if (options.positionModifiers.hasOwnProperty(propName) && positionModifierSpecifiers.includes(propName)) {
                    if ((prop.min !== undefined && prop.min !== null && !Number.isInteger(prop.min)) || (prop.max !== undefined && prop.max !== null && !Number.isInteger(prop.max)))
                        throw new TypeError(`'${propName}' has to be a valid OpenRange with at least one bound`);
                    let filter = (ingredient) => {
                        const id = ingredient.positionModifiers[propName];
                        return id && !(id < prop.min) && !(id > prop.max);
                    };
                    o.positionModifiers.list.push(filter);
                }
            }
        } else {
            throw new TypeError("'positionModifiers' has to be a valid PositionModifierQuery");
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
        throw new TypeError(`expected 'options' to be a RequestOptions object, but received ${typeof options} instead`);

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

    // semantics checks init
    const disallowedTypes = new Map();

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

        for (const t of allTypes.filter(v => v === o.type)) {
            disallowedTypes.set(t, true);
        }
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

        if (category.types.every(v => disallowedTypes.has(v)))
            return { hasConflict: true };

        o.category = options.category.toUpperCase();

        for (const t of allTypes.filter(v => !category.types.includes(v))) {
            disallowedTypes.set(t, true);
        }
    }

    if (options.set !== undefined) {
        if (typeof options.set !== "string")
            throw new TypeError("'set' has to be a string");
        o.set = options.set.toUpperCase();
    }

    if (options.sprite) {
        o.sprite = {
            id: ["number", "string"].includes(typeof options.sprite) ? options.sprite : options.sprite.id,
            damage: options.sprite.damage
        };
        if (typeof o.sprite.id === "string")
            o.sprite.id = minecraftIds.nums[o.sprite.id];
        if (typeof o.sprite.id !== "number")
            throw new TypeError("'sprite' has to be a valid SpriteQuery or a MinecraftId");
    }

    if (options.color) {
        if (!Number.isInteger(options.color[0]) || !Number.isInteger(options.color[1]) || !Number.isInteger(options.color[2]))
            throw new TypeError("'color' has to be a number[] of length 3");
        if (Math.min(options.color[0], options.color[1], options.color[2]) < 0 || Math.max(options.color[0], options.color[1], options.color[2]) > 255)
            throw new RangeError("'color' has to contain only numbers between 0 and 255");

        if (categories[0].types.every(v => disallowedTypes.has(v)))
            return { hasConflict: true };

        o.color = options.color;

        for (const t of weaponTypes.concat(accessoryTypes)) {
            disallowedTypes.set(t, true);
        }
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
        if (Object.getPrototypeOf(options.requirements) === Object.prototype) {
            o.requirements = {
                requireAll: options.requirements.requireAll ?? true,
                list: []
            };
            for (const propName in options.requirements) {
                const req = requirements.find(v => v.key === propName);
                const prop = options.requirements[propName];
                if (req) {
                    let filter;
                    if (req.type.startsWith("__custom__")) { // custom type check
                        switch (req.type.slice(11)) {
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
        } else {
            throw new TypeError("'requirements' has to be a valid ItemRequirementQuery");
        }
    }

    if (options.identifications) {
        if (Object.getPrototypeOf(options.identifications) === Object.prototype) {
            o.identifications = {
                requireAll: options.identifications.requireAll ?? true,
                list: []
            };
            for (const propName in options.identifications) {
                const prop = options.identifications[propName];
                if (options.identifications.hasOwnProperty(propName) && identificationSpecifiers.includes(propName)) {
                    if ((prop.min !== undefined && prop.min !== null && !Number.isInteger(prop.min)) || (prop.max !== undefined && prop.max !== null && !Number.isInteger(prop.max)))
                        throw new TypeError(`'${propName}' has to be a valid OpenRange`);
                    const idName = module.exports.cctosc(propName);
                    let filter = (item) => {
                        const id = item.identifications.find(v => v.name === idName);
                        return id && (!(id.max < prop.min) || !(id.min > prop.max));
                    };
                    o.identifications.list.push(filter);
                }
            }
        } else {
            throw new TypeError("'identifications' has to be a valid IdentificationQuery");
        }
    }

    if (options.stats) {
        if (Object.getPrototypeOf(options.stats) === Object.prototype) {
            o.stats = {
                requireAll: options.stats.requireAll ?? true,
                list: []
            };
            for (const propName in options.stats) {
                const stat = stats.find(v => v.key === propName);
                const prop = options.stats[propName];
                if (stat) {
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
                                filter = (item) => item.stats[propName] && item.stats[propName].max >= (prop.min ?? Number.NEGATIVE_INFINITY) && item.stats[propName].min < (prop.max ?? Number.POSITIVE_INFINITY);
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
        } else {
            throw new TypeError("'stats' has to be a valid ItemStatsQuery");
        }
    }

    if (options.majorIds) {
        if (Object.getPrototypeOf(options.majorIds) === Object.prototype) {
            o.majorIds = {
                requireAll: options.majorIds.requireAll ?? true,
                list: []
            };
            if (!Array.isArray(options.majorIds.list)) // Filter no list object
                throw new TypeError("'majorIds.list' must be an array of MajorIds");
            for (const mId of options.majorIds.list) {
                if (majorIds.find(v => v.name === mId?.toUpperCase())) {
                    o.majorIds.list.push(mId);
                } else {
                    throw new TypeError(`'${mId}' is not a valid MajorId`);
                }
            }
        } else {
            throw new TypeError("'majorIds' has to be a valid MajorIdQuery");
        }
    }

    return o;
}

// fetches a resource from a web API
module.exports._requestAPI = async function (route, apiKey = null, retries = config.defaultRetries, lifetime = config.defaultTimeout) {
    const aborter = new AbortController();
    const timeout = setTimeout(() => aborter.abort(), lifetime);
    const headers = {};
    if (apiKey)
        headers.apiKey = apiKey;
    const data = await fetch(route, {
        method: "GET",
        headers: headers,
        signal: aborter.signal
    })
        .then(async response => {
            clearTimeout(timeout);
            return {
                status: response.status,
                headers: response.headers,
                isJson: config.reuseJson,
                body: await (config.reuseJson ? response.json() : response.text())
            }
        })
        .catch(async err => {
            clearTimeout(timeout);
            if (retries > 0) {
                return await module.exports._requestAPI(route, apiKey, retries - 1, lifetime).catch(e => {
                    throw new WynncraftAPIError(e.message);
                });
            }
            throw new WynncraftAPIError(err);
        });

    return data;
};

// returns a random string of given length
module.exports.randomString = function (length) {
    const validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-";
    let final = "";
    for (let i = 0; i < length; i++) {
        final += validChars[Math.floor(Math.random() * validChars.length)];
    }
    return final;
}

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

// Removes all elements of an array that match filterFn
module.exports.sweepArr = function (arr, filterFn, thisArg = null) {
    const fn = filterFn.bind(thisArg);
    for (let i = 0; i < arr.length; i++) {
        if (fn(arr[i], i, arr)) {
            arr.splice(i, 1);
            i--;
        }
    }
    return arr;
}

// Whaddayouthinkthisdoes? Stop ashking shtewpit questions mate, ey?
module.exports.removeTheBritish = function (word) {
    switch (word) {
        case "ARMOURING":
            return "ARMORING";
        default:
            return word;
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

module.exports.classType = function (className) {
    if (className.includes("darkwizard")) {
        return "DARK_WIZARD";
    } else if (className.includes("mage")) {
        return "MAGE";
    } else if (className.includes("assassin")) {
        return "ASSASSIN";
    } else if (className.includes("ninja")) {
        return "NINJA";
    } else if (className.includes("hunter")) {
        return "HUNTER";
    } else if (className.includes("archer")) {
        return "ARCHER";
    } else if (className.includes("knight")) {
        return "KNIGHT";
    } else if (className.includes("warrior")) {
        return "WARRIOR";
    } else if (className.includes("skyseer")) {
        return "SKYSEER";
    } else if (className.includes("shaman")) {
        return "SHAMAN";
    }
    throw new WynncraftAPIError(`Unknown class ${className}`);
};
