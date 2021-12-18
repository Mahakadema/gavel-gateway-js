
/**
 * Returns information on the ratelimit
 */
export function ratelimit(): Ratelimit

/**
 * Merges the given options into the config and returns the full config
 * @param config A ConfigOptions object containing all settings to be set
 */
export function setConfig(config?: ConfigOptions): Config

/**
 * Returns a raw API response of the requested route; THESE CALLS NEVER CACHE
 * @param options The options for the request
 */
export function fetchRaw(options?: RawRequestOptions): Promise<JSON>

/**
 * Fetches a player off the API
 * @param options The options for the request
 */
export function fetchPlayer(options?: PlayerRequestOptions): Promise<Player>

/**
 * Fetches the player leaderboard off the API
 * list is ordered in ascending order of position
 * (first place at start)
 * @param options The options for the request
 */
export function fetchPlayerLeaderboard(options?: PlayerLeaderboardRequestOptions): Promise<List<LeaderboardPlayer>>

/**
 * Fetches a guild off the API
 * @param options The options for the request
 */
export function fetchGuild(options?: GuildRequestOptions): Promise<Guild>

/**
 * Fetches all guild names off the API
 * @param options The options for the request
 */
export function fetchGuildList(options?: RequestOptions): Promise<List<string>>

/**
 * Fetches the guild leaderboard off the API
 * list is ordered in ascending order of position
 * (first place at start)
 * @param options The options for the request
 */
export function fetchGuildLeaderboard(options?: RequestOptions): Promise<List<LeaderboardGuild>>

/**
 * Fetches the the territory list off the API
 * @param options The options for the request
 */
export function fetchTerritoryList(options?: RequestOptions): Promise<List<Territory>>

/**
 * Fetches all ingredients matching the options off the API.
 * This function relies on caching as it needs to request all
 * ingredients since most filters aren't available on the
 * Wynncraft API. Removing caching for this function or passing
 * low cache times does not cause failure, however it will
 * cause multiple MB of network traffic.
 * @param options The options for the request
 */
export function fetchIngredients(options?: IngredientSearchRequestOptions): Promise<List<Ingredient>>

/**
 * Fetches all ingredient names off the API
 * @param options The options for the request
 */
export function fetchIngredientList(options?: RequestOptions): Promise<List<string>>

/**
 * Fetches all recipes matching the options off the API
 * This function relies on caching as it needs to request all
 * recipes since most filters aren't available on the Wynncraft
 * API. Removing caching for this function or passing low
 * cache times does not cause failure, however it will cause
 * multiple MB of network traffic.
 * @param options The options for the request
 */
export function fetchRecipes(options?: RecipeSearchRequestOptions): Promise<List<Recipe>>

/**
 * Fetches all recipe names off the API
 * @param options The options for the request
 */
export function fetchRecipeList(options?: RequestOptions): Promise<List<string>>

/**
 * Fetches all items matching the options off the API
 * This function relies on caching as it needs to request all
 * item since most filters aren't available on the Wynncraft
 * API. Removing caching for this function or passing low
 * cache times does not cause failure, however it will cause
 * multiple MB of network traffic.
 * @param options The options for the request
 */
export function fetchItems(options?: ItemSearchRequestOptions): Promise<List<Item>>

/**
 * Fetches the online players off the API
 * @param options The options for the request
 */
export function fetchOnlinePlayers(options?: RequestOptions): Promise<List<World>>

/**
 * Fetches the number of online players off the API
 * @param options The options for the request
 */
export function fetchOnlinePlayersSum(options?: RequestOptions): Promise<OnlinePlayersSum>

/**
 * A collection of static data that is used within
 * the library, but can also be used externally
 * @readonly
 */
export var data: {
    /**
     * Information on Identifications
     */
    identifications: IdentificationData[],
    /**
     * Information on Major ID names that are spelled
     * differently in the wrapper than in the API
     */
    majorIds: MajorIdData[],
    /**
     * A translation table for string and numeric minecraft IDs
     */
    minecraftIds: MinecraftIds,
    /**
     * Information on Territories
     */
    territories: Map<string, TerritoryData>
    /**
     * Information on sprites commonly used by wynncraft items;
     * Not all sprites are listed here, namely any ingredients
     * along with some special weapons, currently only `Wybel Paw`
     */
    sprites: Map<ItemSpriteName, Sprite>
}

/**
 * Information to translate raw identification API data to wrapped data
 */
export interface IdentificationData {
    /**
     * The name the wrapper uses
     */
    name: string,
    /**
     * The name used in the item API
     */
    itemApiName: string,
    /**
     * The name used in the ingredient API
     */
    ingredientApiName: string,
    /**
     * Whether the ID has a static value
     */
    static: boolean
}

/**
 * Table to translate raw major ID API data to wrapped data
 */
export interface MajorIdData {
    /**
     * The Major ID name the wrapper uses
     */
    name: string,
    /**
     * The name of the Major ID in the API
     */
    apiName: string,
    /**
     * The name of the Major ID as it shows up in-game;
     * only set after items have been requested once
     */
    inGameName?: string,
    /**
     * The description of the Major ID as it shows up in-game;
     * only set after items have been requested once
     */
    description?: string
}

/**
 * Additional information for a territory
 */
export interface TerritoryData {
    /**
     * The name of the territory
     */
    name: string,
    /**
     * The resource production of the territory
     */
    resources: Resources,
    /**
     * The names of the territories with a trade route to this territory
     */
    connections: string[]
}

/**
 * A table to translate Minecraft ID strings
 * to numeric IDs and back; only item IDs
 */
export interface MinecraftIds {
    /**
     * An object with key value pairs mapping string IDs -> string IDs
     */
    nums: Map<MinecraftStringId, number>,
    /**
     * An object with key value pairs mapping numeric IDs -> string IDs
     */
    strings: Map<number, MinecraftStringId>
}

/**
 * Information on the ratelimits of the API
 */
export interface Ratelimit {
    /**
     * The amount of API keys currently registered in the config
     */
    apiKeys: number,
    /**
     * The ratelimit data per channel used
     */
    channels: RatelimitChannel[],
    /**
     * The amount of requests currently being processed
     */
    totalOngoing: number,
    /**
     * The amount of requests currently awaiting to be processed
     */
    totalQueued: number
}

/**
 * A Ratelimit channel has has a private ratelimit that
 * is unaffected by other calls to the API; only calls
 * using the `apiKey` of the channel affect the ratelimit
 * If no API keys are set in the config, only one channel
 * exists with the `apiKey` being set to `null`
 */
export interface RatelimitChannel {
    /**
     * The API key being used with this channel
     */
    apiKey: string,
    /**
     * The limit the channel gets reset to upon reset
     */
    total: number,
    /**
     * Requests remaining on this channel
     */
    remaining: number,
    /**
     * Amount of milliseconds until this channels'
     * remaining requests are reset to the limit
     */
    reset: number,
    /**
     * The amount of requests currently queued
     * to be processed using this key
     */
    queued: number
}

/**
 * Represents the basis of all objects returned by API requests
 */
export class BaseAPIObject {
    public constructor(requestTimestamp: number, timestamp: number);

    /**
     * The unix timestamp indicating when this request started executing
     */
    public requestedAt: number;
    /**
     * The unix timestamp indicating when the data of this request
     * was last updated; note that this timestamp does not indicate
     * when the data was created, just when it was last synced to
     * the currently requested API node. The leaderboards, for
     * instance, update once per hour, yet this timestamp updates
     * approximately once every 30 seconds for leaderboard routes.
     */
    public timestamp: number;
}

/**
 * The configuration of the library
 */
export interface Config {
    /**
     * The maximum amount of queued requests before
     * new requests are rejected with an error
     * @default 50
     */
    maxQueueLength: number,
    /**
     * Whether to allow requests to use the cache;
     * overridden by `allowCache` in request options
     * @default true
     */
    allowCacheByDefault: boolean,
     /**
     * Whether to allow request stacking in raw API calls;
     * overridden by `allowStacking` in request options
     * @default true
     */
    allowStackingByDefault: boolean,
    /**
     * The API keys being used
     */
    apiKeys: string[],
    /**
     * The amount of times a request should be retried on error;
     * overridden by `retries` in request options
     * @default 3
     */
    defaultRetries: number,
    /**
     * The amount of milliseconds a until a request should be rejected;
     * overridden by `timeout` in request options
     * @default 30000
     */
    defaultTimeout: number,
    /**
     * Information on all possible routes
     */
    routes: Routes
}

/**
 * The options to set the config to
 */
export interface ConfigOptions {
    /**
     * How many request should be allowed to be queued
     * before the wrapper rejects new requests with an error
     */
    maxQueueLength?: number,
    /**
     * Whether to allow requests to use the cache;
     * overridden by `allowCache` in request options
     */
    allowCacheByDefault?: boolean,
    /**
     * Whether to allow request stacking in raw API calls;
     * overridden by `allowStacking` in request options
     */
    allowStackingByDefault?: boolean,
    /**
     * The API keys to use
     */
    apiKeys?: string[],
    /**
     * The amount of times a request should be retried on
     * error; overridden by `retries` in request options
     */
    defaultRetries?: number,
    /**
     * The amount of milliseconds a until a request should be
     * rejected; overridden by `timeout` in request options
     */
    defaultTimeout?: number,
    /**
     * The amount of milliseconds to cache requests of these
     * routes for; overridden by `cacheFor` in request options
     */
    defaultCacheTimes?: CacheTimeOptions
}

/**
 * Stores information on all possible routes
 */
export interface Routes {
    /**
     * Player stats route
     */
    PLAYER: Route,
    /**
     * Player combat leaderboard route
     */
    PLAYER_COMBAT_LEADERBOARD: Route,
    /**
     * Player pvp leaderboard route
     */
    PLAYER_PVP_LEADERBOARD: Route,
    /**
     * Guild stats route
     */
    GUILD: Route,
    /**
     * Guild list route
     */
    GUILD_LIST: Route,
    /**
     * Guild leaderboard route
     */
    GUILD_LEADERBOARD: Route,
    /**
     * Territory list route
     */
    TERRITORY_LIST: Route,
    /**
     * Ingredient search route
     */
    INGREDIENT_SEARCH: Route,
    /**
     * Ingredient list route
     */
    INGREDIENT_LIST: Route,
    /**
     * Recipe search route
     */
    RECIPE_SEARCH: Route,
    /**
     * Recipe list route
     */
    RECIPE_LIST: Route,
    /**
     * Item search route
     */
    ITEM_SEARCH: Route,
    /**
     * Athenas Item route
     */
    ATHENA_ITEMS: Route,
    /**
     * Online players list route
     */
    ONLINE_PLAYERS: Route,
    /**
     * Online players sum route
     */
    ONLINE_PLAYERS_SUM: Route
}

/**
 * A singular route on the API
 */
export interface Route {
    /**
     * The URL of the route
     */
    url: string,
    /**
     * The amount of milliseconds to cache data from this route for
     */
    cacheTime: number,
    /**
     * The API version of this route the wrapper was build for
     */
    version: string | number
}

/**
 * Options specifying cache times for routes
 */
export interface CacheTimeOptions {
    /**
     * The cache time for player stats
     */
    PLAYER?: number,
    /**
     * The cache time for the player combat leaderboard
     */
    PLAYER_COMBAT_LEADERBOARD?: number,
    /**
     * The cache time for the player pvp leaderboard
     */
    PLAYER_PVP_LEADERBOARD?: number,
    /**
     * The cache time for guild stats
     */
    GUILD?: number,
    /**
     * The cache time for the guild list
     */
    GUILD_LIST?: number,
    /**
     * The cache time for the guild leaderboard
     */
    GUILD_LEADERBOARD?: number,
    /**
     * The cache time for the territory list
     */
    TERRITORY_LIST?: number,
    /**
     * The cache time for the ingredient search
     */
    INGREDIENT_SEARCH?: number,
    /**
     * The cache time for the ingredient list
     */
    INGREDIENT_LIST?: number,
    /**
     * The cache time for the recipe search
     */
    RECIPE_SEARCH?: number,
    /**
     * The cache time for the recipe list
     */
    RECIPE_LIST?: number,
    /**
     * The cache time for the item search
     */
    ITEM_SEARCH?: number,
    /**
     * The cache time for the online players list
     */
    ONLINE_PLAYERS?: number,
    /**
     * The cache time for the online players sum
     */
    ONLINE_PLAYERS_SUM?: number
}

/**
 * The base options for a generic API request
 */
export interface RequestOptions {
    /**
     * The API key to use in this request; the key has to be 
     * registered in the config; if this is not given, the
     * registered key with the most free requests will be selected
     */
    apiKey?: string,
    /**
     * Whether to allow this request to pull from cache if possible
     */
    allowCache?: boolean,
    /**
     * Whether this request should be put to the front of the queue,
     * executing before any non-priority requests are handled
     * @default false
     */
    priority?: boolean,
    /**
     * The amount of times to retry the request on error
     */
    retries?: number,
    /**
     * The amount of milliseconds a until the request should be rejected
     */
    timeout?: number,
    /**
     * The amount of time the request should be cached for
     */
    cacheFor?: number,
    /**
     * Whether to ignore version errors; only
     * use this to resolve temporary conflicts
     * while the library awaits being updated
     * @default false
     */
    ignoreVersion?: boolean
}

/**
 * The options for a raw API request
 */
export interface RawRequestOptions extends RequestOptions {
    /**
     * The API route to request
     */
    route: string
    /**
     * Whether requests to the same route should be allowed
     * to be stacked; stacked requests only use a single
     * API request and return the EXACT same object as all
     * other requests in the stack; KEEPING THIS ENABLED
     * CAN CAUSE ERRORS IF REQUESTED DATA IS MUTATED IN
     * DOWNSTREAM CODE
     */
    allowStacking?: boolean,
}

/**
 * The options for a player API request
 */
export interface PlayerRequestOptions extends RequestOptions {
    /**
     * A player UUID or name
     */
    player: string
}

/**
 * The options for a player leaderboard API request
 */
export interface PlayerLeaderboardRequestOptions extends RequestOptions {
    /**
     * The scope of the leaderboard; whether to rank
     * by level of a single class or across all classes
     * @default "TOTAL"
     */
    scope?: PlayerLeaderboardScope,
    /**
     * The type of level or levels to rank
     * Only use Solo types if the solo scope
     * is selected and vice versa
     */
    type?: PlayerSoloLeaderboardType | PlayerTotalLeaderboardType,
}

/**
 * The options for a guild API request
 */
export interface GuildRequestOptions extends RequestOptions {
    /**
     * The name of the guild
     */
    guild: string,
    /**
     * Whether to display more precise and additional
     * information, may cause extra API requests
     * @default false
     */
    fetchAdditionalStats?: boolean
}

/**
 * The options for an ingredient API request
 */
export interface IngredientSearchRequestOptions extends RequestOptions {
    /**
     * Only match ingredients containing this
     * string in their name; case-insensitive
     */
    name?: string,
    /**
     * Only match ingredients containing this string in
     * their name as displayed in-game; case-insensitive
     */
    displayName?: string,
    /**
     * Only match ingredients of this tier;
     * Values have to be integer and between 0 and 3;
     * The Range has to have at least one bound
     */
    tier?: OpenRange | number,
    /**
     * Only match ingredients of this level;
     * Values have to be integer;
     * The Range has to have at least one bound
     */
    level?: OpenRange | number,
    /**
     * Only match ingredients that match this Filter
     */
    skills?: CraftingSkillQuery,
    /**
     * Only match ingredients using this sprite
     */
    sprite?: SpriteQuery | MinecraftId,
    /**
     * Only match ingredients with these identifications;
     * Values for ID bounds have to be integer
     */
    identifications?: IdentificationQuery,
    /**
     * Only match ingredients with these restricted identifications;
     * Values for ID bounds have to be integer
     */
    restrictedIds?: RestrictedIdQuery
    /**
     * Only match ingredients with these positional modifiers;
     * Values for Modifier bounds have to be integer
     */
    positionModifiers?: PositionModifierQuery
}

/**
 * The options for a recipe API request
 */
export interface RecipeSearchRequestOptions extends RequestOptions {
    /**
     * Only match the recipe with this ID
     */
    id?: string,
    /**
     * Only match recipes within this level range;
     * Values have to be integer;
     * The Range has to have at least one bound
     */
    level?: OpenRange | number,
    /**
     * Only match recipes of this item type
     */
    type?: CraftableItemType,
    /**
     * Only match recipes of this item category
     */
    category?: ItemCategory,
    /**
     * Only match recipes using this crafting skill
     */
    skill?: CraftingSkill,
    /**
     * Only match recipes if their durability lies within this range;
     * Values have to be integer;
     * The Range has to have at least one bound
     */
    durability?: OpenRange,
    /**
     * Only match recipes if their duration lies within this range;
     * Values have to be integer;
     * The Range has to have at least one bound
     */
    duration?: OpenRange,
    /**
     * Only match recipes if their basic duration lies within this range;
     * Values have to be integer;
     * The Range has to have at least one bound
     */
    basicDuration?: OpenRange,
    /**
     * Only match recipes if their health lies within this range;
     * Values have to be integer;
     * The Range has to have at least one bound
     */
    health?: OpenRange,
    /**
     * Only match recipes if their damage lies within this range;
     * Values have to be integer;
     * The Range has to have at least one bound
     */
    damage?: OpenRange
}

/**
 * The options for an item API request
 */
export interface ItemSearchRequestOptions extends RequestOptions {
    /**
     * Only match items containing this string in their `name`;
     * case-insensitive; use the displayName filter for names as shown in-game
     */
    name?: string,
    /**
     * Only match items containing this string in their `displayName`;
     * case-insensitive
     */
    displayName?: string,
    /**
     * Only match items of this Rarity
     */
    tier?: ItemRarity,
    /**
     * Only match items of this type
     */
    type?: ItemType,
    /**
     * Only match items of this category
     */
    category?: ItemCategory,
    /**
     * Only match items that are part of this set;
     * set is currently only used by the `LEAF` set
     */
    set?: string,
    /**
     * Only match items using this visual sprite
     */
    sprite?: SpriteQuery | MinecraftId,
    /**
     * Only match items using this color;
     * the array has to have a length of 3;
     * the numbers must be between 0 and 255
     */
    color?: number[],
    /**
     * Only match items obtained from this source
     */
    dropType?: ItemDropType,
    /**
     * Only match items containing this string in their lore; case-insensitive
     */
    lore?: string,
    /**
     * Only match items with this restriction
     */
    restriction?: ItemRestriction,
    /**
     * Only match items that match the requirement query;
     * values in ranges must be integer
     */
    requirements?: ItemRequirementQuery,
    /**
     * Only match items that match the identification query;
     * values in ranges must be integer;
     * to search for an ID with any value range, use an empty Range `{}`
     */
    identifications?: IdentificationQuery,
    /**
     * Only match items that match the stat query;
     * values in ranges must be integer
     */
    stats?: ItemStatQuery,
    /**
     * Only match items that match the major ID query
     */
    majorIds?: MajorIdQuery
}

/**
 * A scope of leaderboard ranking
 */
export type PlayerLeaderboardScope =
    | "TOTAL"
    | "SOLO";

/**
 * Player leaderboards available for total
 */
export type PlayerTotalLeaderboardType =
    | "PVP"
    | "COMBAT"
    | "PROFESSION"
    | "COMBINED";

/**
 * Player leaderboards available for solo
 */
export type PlayerSoloLeaderboardType =
    | "COMBAT"
    | "PROFESSION"
    | "COMBINED"
    | "MINING"
    | "WOODCUTTING"
    | "FARMING"
    | "FISHING"
    | "SCRIBING"
    | "COOKING"
    | "ALCHEMISM"
    | "WOODWORKING"
    | "WEAPONSMITHING"
    | "TAILORING"
    | "ARMORING"
    | "JEWELING";

/**
 * An ID filter to match when requesting items or ingredients
 */
export interface IdentificationQuery {
    /**
     * Whether all specified filters have to
     * be satisfied, or if any can match
     * @default true
     */
    requireAll?: boolean,

    /**
     * The Strength identification has to
     * have possible values within this range
     */
    strength?: OpenRange,
    /**
     * The Dexterity identification has to
     * have possible values within this range
     */
    dexterity?: OpenRange,
    /**
     * The Intelligence identification has to
     * have possible values within this range
     */
    intelligence?: OpenRange,
    /**
     * The Defence identification has to
     * have possible values within this range
     */
    defence?: OpenRange,
    /**
     * The Agility identification has to
     * have possible values within this range
     */
    agility?: OpenRange,
    /**
     * The Main Attack Damage % identification has
     * to have possible values within this range
     */
    mainAttackDamagePercent?: OpenRange,
    /**
     * The Raw Main Attack Damage identification has
     * to have possible values within this range
     */
    mainAttackDamageRaw?: OpenRange,
    /**
     * The Spell Damage % identification has to
     * have possible values within this range
     */
    spellDamagePercent?: OpenRange,
    /**
     * The Raw Spell Damage identification has to
     * have possible values within this range
     */
    spellDamageRaw?: OpenRange,
    /**
     * The Raw Rainbow Spell Damage identification
     * has to have possible values within this range
     */
    rainbowSpellDamageRaw?: OpenRange,
    /**
     * The Earth Damage % identification has to
     * have possible values within this range
     */
    earthDamage?: OpenRange,
    /**
     * The Thunder Damage % identification has
     * to have possible values within this range
     */
    thunderDamage?: OpenRange,
    /**
     * The Water Damage % identification has to
     * have possible values within this range
     */
    waterDamage?: OpenRange,
    /**
     * The Fire Damage % identification has to
     * have possible values within this range
     */
    fireDamage?: OpenRange,
    /**
     * The Air Damage % identification has to
     * have possible values within this range
     */
    airDamage?: OpenRange,
    /**
     * The Earth Defence % identification has
     * to have possible values within this range
     */
    earthDefence?: OpenRange,
    /**
     * The Thunder Defence % identification has
     * to have possible values within this range
     */
    thunderDefence?: OpenRange,
    /**
     * The Water Defence % identification has
     * to have possible values within this range
     */
    waterDefence?: OpenRange,
    /**
     * The Fire Defence % identification has to
     * have possible values within this range
     */
    fireDefence?: OpenRange,
    /**
     * The Air Defence % identification has to
     * have possible values within this range
     */
    airDefence?: OpenRange,
    /**
     * The Health Regen % identification has
     * to have possible values within this range
     */
    healthRegenPercent?: OpenRange,
    /**
     * The Raw Health Regen identification has
     * to have possible values within this range
     */
    healthRegenRaw?: OpenRange,
    /**
     * The Health identification has to have
     * possible values within this range
     */
    health?: OpenRange,
    /**
     * The Life Steal identification has to
     * have possible values within this range
     */
    lifeSteal?: OpenRange,
    /**
     * The Mana Regen identification has to
     * have possible values within this range
     */
    manaRegen?: OpenRange,
    /**
     * The Mana Steal identification has to
     * have possible values within this range
     */
    manaSteal?: OpenRange,
    /**
     * The 1st Spell Cost % identification has
     * to have possible values within this range
     */
    spellCostPct1?: OpenRange,
    /**
     * The 1st Raw Spell Cost identification has
     * to have possible values within this range
     */
    spellCostRaw1?: OpenRange,
    /**
     * The 2nd Spell Cost % identification has
     * to have possible values within this range
     */
    spellCostPct2?: OpenRange,
    /**
     * The 2nd Raw Spell Cost identification has
     * to have possible values within this range
     */
    spellCostRaw2?: OpenRange,
    /**
     * The 3rd Spell Cost % identification has
     * to have possible values within this range
     */
    spellCostPct3?: OpenRange,
    /**
     * The 3rd Raw Spell Cost identification has
     * to have possible values within this range
     */
    spellCostRaw3?: OpenRange,
    /**
     * The 4th Spell Cost % identification has
     * to have possible values within this range
     */
    spellCostPct4?: OpenRange,
    /**
     * The 4th Raw Spell Cost identification has
     * to have possible values within this range
     */
    spellCostRaw4?: OpenRange,
    /**
     * The Attack Speed identification has to
     * have possible values within this range
     */
    attackSpeed?: OpenRange,
    /**
     * The Poison identification has to have
     * possible values within this range
     */
    poison?: OpenRange,
    /**
     * The Thorns identification has to have
     * possible values within this range
     */
    thorns?: OpenRange,
    /**
     * The Reflection identification has to
     * have possible values within this range
     */
    reflection?: OpenRange,
    /**
     * The Exploding identification has to
     * have possible values within this range
     */
    exploding?: OpenRange,
    /**
     * The Jump Height identification has to
     * have possible values within this range
     */
    jumpHeight?: OpenRange,
    /**
     * The Walk Speed identification has to
     * have possible values within this range
     */
    walkSpeed?: OpenRange,
    /**
     * The Sprint Duration identification has
     * to have possible values within this range
     */
    sprintDuration?: OpenRange,
    /**
     * The Sprint Regen identification has to
     * have possible values within this range
     */
    sprintRegen?: OpenRange,
    /**
     * The Soul Point Regen identification has
     * to have possible values within this range
     */
    soulPointRegen?: OpenRange,
    /**
     * The Gathering Speed identification has
     * to have possible values within this range
     */
    gatheringSpeed?: OpenRange,
    /**
     * The Gathering XP Bonus identification has
     * to have possible values within this range
     */
    gatheringXpBonus?: OpenRange,
    /**
     * The XP Bonus identification has to have
     * possible values within this range
     */
    xpBonus?: OpenRange,
    /**
     * The Loot Bonus identification has to
     * have possible values within this range
     */
    lootBonus?: OpenRange,
    /**
     * The Loot Quality identification has to
     * have possible values within this range
     */
    lootQuality?: OpenRange,
    /**
     * The Stealing identification has to
     * have possible values within this range
     */
    stealing?: OpenRange
}

/**
 * A crafting profession filter to match when requesting ingredients
 */
export interface CraftingSkillQuery {
    /**
     * Whether the ingredient has to be usable for all
     * specified Crafting Skills, or if any are sufficient
     * @default true
     */
    requireAll?: boolean,

    /**
     * A list of Crafting Skills to look for
     */
    list: CraftingSkill[]
}

/**
 * A position modifier filter to match when requesting ingredients
 */
export interface PositionModifierQuery {
    /**
     * Whether all specified filters have to be satisfied, or if any can match
     * @default true
     */
    requireAll?: boolean,

    /**
     * A range the Left modifier has to be within
     */
    left?: OpenRange,
    /**
     * A range the Right modifier has to be within
     */
    right?: OpenRange,
    /**
     * A range the Above modifier has to be within
     */
    above?: OpenRange,
    /**
     * A range the Under modifier has to be within
     */
    under?: OpenRange,
    /**
     * A range the Touching modifier has to be within
     */
    touching?: OpenRange,
    /**
     * A range the Not Touching modifier has to be within
     */
    notTouching?: OpenRange
}

/**
 * A requirement filter to match when requesting items
 */
export interface ItemRequirementQuery {
    /**
     * Whether all specified filters have to be satisfied, or if any can match
     * @default true
     */
    requireAll?: boolean,

    /**
     * The level to match
     */
    level?: OpenRange,
    /**
     * Only matches items with this quest requirement; case-insensitive
     */
    quest?: string,
    /**
     * Only match items with this class requirement
     */
    class?: ClassType,
    /**
     * Only match items with a Strength req within this range
     */
    strength?: OpenRange,
    /**
     * Only match items with a Dexterity req within this range
     */
    dexterity?: OpenRange,
    /**
     * Only match items with a Intelligence req within this range
     */
    intelligence?: OpenRange,
    /**
     * Only match items with a Defence req within this range
     */
    defence?: OpenRange,
    /**
     * Only match items with a Agility req within this range
     */
    agility?: OpenRange
}

/**
 * A major ID filter to match when requesting Items
 */
export interface MajorIdQuery {
    /**
     * Whether the item has to have all major IDs, or if any are sufficient
     * @default true
     */
    requireAll?: boolean,
    
    /**
     * A list of Major IDs to look for
     */
    list: MajorId[]
}

/**
 * A stat filter to match when requesting items
 */
export interface ItemStatQuery {
    /**
     * Whether all specified filters have to be satisfied, or if any can match
     * @default true
     */
    requireAll?: boolean,

    /**
     * Only match items with Powder Slots within this range
     */
    powderSlots?: OpenRange,
    /**
     * Only match items with Health within this range
     */
    health?: OpenRange,
    /**
     * Only match items with Earth Defence within this range
     */
    earthDefence?: OpenRange,
    /**
     * Only match items with Thunder Defence within this range
     */
    thunderDefence?: OpenRange,
    /**
     * Only match items with Water Defence within this range
     */
    waterDefence?: OpenRange,
    /**
     * Only match items with Fire Defence within this range
     */
    fireDefence?: OpenRange,
    /**
     * Only match items with Air Defence within this range
     */
    airDefence?: OpenRange,
    /**
     * Only match items with Neutral Damage within this range
     */
    damage?: OpenRange,
    /**
     * Only match items with Earth Damage within this range
     */
    earthDamage?: OpenRange,
    /**
     * Only match items with Thunder Damage within this range
     */
    thunderDamage?: OpenRange,
    /**
     * Only match items with Water Damage within this range
     */
    waterDamage?: OpenRange,
    /**
     * Only match items with Fire Damage within this range
     */
    fireDamage?: OpenRange,
    /**
     * Only match items with Air Damage within this range
     */
    airDamage?: OpenRange,
    /**
     * Only match items with Attack Speeds matching one these
     */
    attackSpeed?: AttackSpeed[]
}

/**
 * A visual sprite to match in ingredient or item search
 */
export interface SpriteQuery {
    /**
     * The ID of the sprite
     */
    id: MinecraftId,
    /**
     * The damage value (or data value) of the sprite
     */
    damage?: number
}

/**
 * A value resolvable to a minecraft item id
 */
export type MinecraftId = MinecraftStringId | number;

/**
 * A value resolvable to a minecraft item id in string form
 */
export type MinecraftStringId = `minecraft:${string}`;

/**
 * A filter for restricted IDs to match when searching for ingredients
 */
export interface RestrictedIdQuery {
    /**
     * Whether all specified filters have to be satisfied, or if any can match
     * @default true
     */
    requireAll?: boolean,

    /**
     * Only match ingredients with a durability modifier within this range
     */
    durability?: OpenRange,
    /**
     * Only match ingredients with a strength
     * requirement modifier within this range
     */
    strengthRequirement?: OpenRange,
    /**
     * Only match ingredients with a dexterity
     * requirement modifier within this range
     */
    dexterityRequirement?: OpenRange,
    /**
     * Only match ingredients with a intelligence
     * requirement modifier within this range
     */
    intelligenceRequirement?: OpenRange,
    /**
     * Only match ingredients with a defence
     * requirement modifier within this range
     */
    defenceRequirement?: OpenRange,
    /**
     * Only match ingredients with a agility
     * requirement modifier within this range
     */
    agilityRequirement?: OpenRange,
    /**
     * Only match ingredients with an attack
     * speed modifier within this range
     */
    attackSpeed?: OpenRange,
    /**
     * Only match ingredients with a powder
     * slot modifier within this range
     */
    powderSlots?: OpenRange,
    /**
     * Only match ingredients with a
     * duration modifier within this range
     */
    duration?: OpenRange,
    /**
     * Only match ingredients with a
     * charges modifier within this range
     */
    charges?: OpenRange
}

/**
 * A range containing numbers between certain threshholds,
 * or above/below a threshhold if only one is given;
 * some input fields for OpenRanges may require integers
 */
export interface OpenRange {
    /**
     * The minimal value to select
     */
    min?: number,
    /**
     * The maximum value to select
     */
    max?: number
}

/**
 * A range containing numbers between certain threshholds;
 * some input fields for Ranges may require integers
 */
export interface Range {
    /**
     * The minimal value to select
     */
    min: number,
    /**
     * The maximum value to select
     */
    max: number
}

/**
 * All weapon, armor, and accessory types
 */
export type ItemType =
    | "BOOTS"
    | "LEGGINGS"
    | "CHESTPLATE"
    | "HELMET"
    | "SPEAR"
    | "WAND"
    | "BOW"
    | "DAGGER"
    | "RELIK"
    | "RING"
    | "BRACELET"
    | "NECKLACE";

/**
 * A category to search items or recipes by
 */
export type ItemCategory =
    | "ARMOR"
    | "WEAPON"
    | "ACCESSORY";

/**
 * A specific type of item craftable using professions
 */
export type CraftableItemType =
    | "BOOTS"
    | "BOW"
    | "BRACELET"
    | "CHESTPLATE"
    | "DAGGER"
    | "FOOD"
    | "HELMET"
    | "NECKLACE"
    | "LEGGINGS"
    | "POTION"
    | "RELIK"
    | "RING"
    | "SCROLL"
    | "SPEAR"
    | "WAND";

/**
 * A crafting profession skill
 */
export type CraftingSkill =
    | "ARMORING"
    | "ALCHEMISM"
    | "COOKING"
    | "JEWELING"
    | "SCRIBING"
    | "TAILORING"
    | "WEAPONSMITHING"
    | "WOODWORKING";

/**
 * A restriction put on an item
 */
export type ItemRestriction =
    | "UNTRADABLE"
    | "QUEST"; // "Quest Item"

/**
 * A weapon attack speed
 */
export type AttackSpeed =
    | "SUPER_FAST"
    | "VERY_FAST"
    | "FAST"
    | "NORMAL"
    | "SLOW"
    | "VERY_SLOW"
    | "SUPER_SLOW";

/**
 * An item rarity tier
 */
export type ItemRarity =
    | "MYTHIC"
    | "FABLED"
    | "LEGENDARY"
    | "RARE"
    | "SET"
    | "UNIQUE"
    | "NORMAL";

/**
 * A source an item can be obtained from
 */
export type ItemDropType =
    | "NEVER"
    | "NORMAL"
    | "DUNGEON"
    | "LOOTCHEST";

/**
 * A name for an item identification
 */
export type IdentificationName =
    | "STRENGTH"
    | "DEXTERITY"
    | "INTELLIGENCE"
    | "DEFENCE"
    | "AGILITY"

    | "MAIN_ATTACK_DAMAGE_PERCENT"
    | "MAIN_ATTACK_DAMAGE_RAW"
    | "SPELL_DAMAGE_PERCENT"
    | "SPELL_DAMAGE_RAW"
    | "RAINBOW_SPELL_DAMAGE_RAW"
    | "EARTH_DAMAGE"
    | "THUNDER_DAMAGE"
    | "WATER_DAMAGE"
    | "FIRE_DAMAGE"
    | "AIR_DAMAGE"

    | "EARTH_DEFENCE"
    | "THUNDER_DEFENCE"
    | "WATER_DEFENCE"
    | "FIRE_DEFENCE"
    | "AIR_DEFENCE"
    | "HEALTH_REGEN_PERCENT"
    | "HEALTH_REGEN_RAW"
    | "HEALTH"
    | "LIFE_STEAL"

    | "MANA_REGEN"
    | "MANA_STEAL"
    | "SPELL_COST_PCT_1"
    | "SPELL_COST_RAW_1"
    | "SPELL_COST_PCT_2"
    | "SPELL_COST_RAW_2"
    | "SPELL_COST_PCT_3"
    | "SPELL_COST_RAW_3"
    | "SPELL_COST_PCT_4"
    | "SPELL_COST_RAW_4"

    | "ATTACK_SPEED"
    | "POISON"
    | "THORNS"
    | "REFLECTION"
    | "EXPLODING"
    | "JUMP_HEIGHT"
    | "WALK_SPEED"
    | "SPRINT_DURATION"
    | "SPRINT_REGEN"
    | "SOUL_POINT_REGEN"
    | "GATHERING_SPEED"
    | "GATHERING_XP_BONUS"
    | "XP_BONUS"
    | "LOOT_BONUS"
    | "LOOT_QUALITY"
    | "STEALING";

/**
 * A name for an item major ID
 */
export type MajorId =
    | "SAVIOURS_SACRIFICE" // HERO
    | "PEACEFUL_EFFIGY"
    | "FURIOUS_EFFIGY"
    | "PLAGUE"
    | "HAWKEYE"
    | "CHERRY_BOMBS"
    | "FLASHFREEZE"
    | "GREED"
    | "LIGHTWEIGHT"
    | "CAVALRYMAN"
    | "MAGNET"
    | "FISSION"
    | "RALLY"
    | "GUARDIAN"
    | "HEART_OF_THE_PACK" // ALTRUISM
    | "TRANSCENDENCE" // ARCANES
    | "ENTROPY"
    | "ROVING_ASSASSIN" // ROVINGASSASSIN
    | "GEOCENTRISM"
    | "FREERUNNER"
    | "MADNESS"
    | "SORCERY"
    | "EXPLOSIVE_IMPACT"
    | "TAUNT";

/**
 * A sprite name commonly used by Wynncraft items
 */
export type ItemSpriteName =
    | "PLAYER_HEAD"

    | "LEATHER_HELMET"
    | "LEATHER_CHESTPLATE"
    | "LEATHER_LEGGINGS"
    | "LEATHER_BOOTS"
    | "GOLDEN_HELMET"
    | "GOLDEN_CHESTPLATE"
    | "GOLDEN_LEGGINGS"
    | "GOLDEN_BOOTS"
    | "CHAIN_HELMET"
    | "CHAIN_CHESTPLATE"
    | "CHAIN_LEGGINGS"
    | "CHAIN_BOOTS"
    | "IRON_HELMET"
    | "IRON_CHESTPLATE"
    | "IRON_LEGGINGS"
    | "IRON_BOOTS"
    | "DIAMOND_HELMET"
    | "DIAMOND_CHESTPLATE"
    | "DIAMOND_LEGGINGS"
    | "DIAMOND_BOOTS"

    | "WAND_DEFAULT_0"
    | "WAND_DEFAULT_1"
    | "WAND_DEFAULT_2"
    | "WAND_EARTH_0"
    | "WAND_EARTH_1"
    | "WAND_EARTH_2"
    | "WAND_THUNDER_0"
    | "WAND_THUNDER_1"
    | "WAND_THUNDER_2"
    | "WAND_WATER_0"
    | "WAND_WATER_1"
    | "WAND_WATER_2"
    | "WAND_FIRE_0"
    | "WAND_FIRE_1"
    | "WAND_FIRE_2"
    | "WAND_AIR_0"
    | "WAND_AIR_1"
    | "WAND_AIR_2"
    | "WAND_MULTI_0"
    | "WAND_MULTI_1"
    | "WAND_MULTI_2"

    | "SPEAR_DEFAULT_0"
    | "SPEAR_DEFAULT_1"
    | "SPEAR_EARTH_0"
    | "SPEAR_EARTH_1"
    | "SPEAR_EARTH_2"
    | "SPEAR_THUNDER_0"
    | "SPEAR_THUNDER_1"
    | "SPEAR_THUNDER_2"
    | "SPEAR_WATER_0"
    | "SPEAR_WATER_1"
    | "SPEAR_WATER_2"
    | "SPEAR_FIRE_0"
    | "SPEAR_FIRE_1"
    | "SPEAR_FIRE_2"
    | "SPEAR_AIR_0"
    | "SPEAR_AIR_1"
    | "SPEAR_AIR_2"
    | "SPEAR_MULTI_0"
    | "SPEAR_MULTI_1"
    | "SPEAR_MULTI_2"

    | "DAGGER_DEFAULT_0"
    | "DAGGER_DEFAULT_1"
    | "DAGGER_EARTH_0"
    | "DAGGER_EARTH_1"
    | "DAGGER_EARTH_2"
    | "DAGGER_THUNDER_0"
    | "DAGGER_THUNDER_1"
    | "DAGGER_THUNDER_2"
    | "DAGGER_WATER_0"
    | "DAGGER_WATER_1"
    | "DAGGER_WATER_2"
    | "DAGGER_FIRE_0"
    | "DAGGER_FIRE_1"
    | "DAGGER_FIRE_2"
    | "DAGGER_AIR_0"
    | "DAGGER_AIR_1"
    | "DAGGER_AIR_2"
    | "DAGGER_MULTI_0"
    | "DAGGER_MULTI_1"
    | "DAGGER_MULTI_2"

    | "BOW_DEFAULT_0"
    | "BOW_DEFAULT_1"
    | "BOW_EARTH_0"
    | "BOW_EARTH_1"
    | "BOW_EARTH_2"
    | "BOW_THUNDER_0"
    | "BOW_THUNDER_1"
    | "BOW_THUNDER_2"
    | "BOW_WATER_0"
    | "BOW_WATER_1"
    | "BOW_WATER_2"
    | "BOW_FIRE_0"
    | "BOW_FIRE_1"
    | "BOW_FIRE_2"
    | "BOW_AIR_0"
    | "BOW_AIR_1"
    | "BOW_AIR_2"
    | "BOW_MULTI_0"
    | "BOW_MULTI_1"
    | "BOW_MULTI_2"

    | "RELIK_DEFAULT_0"
    | "RELIK_DEFAULT_1"
    | "RELIK_EARTH_0"
    | "RELIK_EARTH_1"
    | "RELIK_EARTH_2"
    | "RELIK_THUNDER_0"
    | "RELIK_THUNDER_1"
    | "RELIK_THUNDER_2"
    | "RELIK_WATER_0"
    | "RELIK_WATER_1"
    | "RELIK_WATER_2"
    | "RELIK_FIRE_0"
    | "RELIK_FIRE_1"
    | "RELIK_FIRE_2"
    | "RELIK_AIR_0"
    | "RELIK_AIR_1"
    | "RELIK_AIR_2"
    | "RELIK_MULTI_0"
    | "RELIK_MULTI_1"
    | "RELIK_MULTI_2"

    | "RING_DEFAULT_0"
    | "RING_DEFAULT_1"
    | "RING_EARTH_0"
    | "RING_EARTH_1"
    | "RING_THUNDER_0"
    | "RING_THUNDER_1"
    | "RING_WATER_0"
    | "RING_WATER_1"
    | "RING_FIRE_0"
    | "RING_FIRE_1"
    | "RING_AIR_0"
    | "RING_AIR_1"
    | "RING_MULTI_0"
    | "RING_MULTI_1"
    | "RING_SPECIAL_0"
    | "RING_SPECIAL_1"
    | "RING_SPECIAL_2"

    | "BRACELET_DEFAULT_0"
    | "BRACELET_DEFAULT_1"
    | "BRACELET_EARTH_0"
    | "BRACELET_EARTH_1"
    | "BRACELET_THUNDER_0"
    | "BRACELET_THUNDER_1"
    | "BRACELET_WATER_0"
    | "BRACELET_WATER_1"
    | "BRACELET_FIRE_0"
    | "BRACELET_FIRE_1"
    | "BRACELET_AIR_0"
    | "BRACELET_AIR_1"
    | "BRACELET_MULTI_0"
    | "BRACELET_MULTI_1"

    | "NECKLACE_DEFAULT_0"
    | "NECKLACE_DEFAULT_1"
    | "NECKLACE_EARTH_0"
    | "NECKLACE_EARTH_1"
    | "NECKLACE_THUNDER_0"
    | "NECKLACE_THUNDER_1"
    | "NECKLACE_WATER_0"
    | "NECKLACE_WATER_1"
    | "NECKLACE_FIRE_0"
    | "NECKLACE_FIRE_1"
    | "NECKLACE_AIR_0"
    | "NECKLACE_AIR_1"
    | "NECKLACE_MULTI_0"
    | "NECKLACE_MULTI_1"
    | "NECKLACE_SPECIAL_0"
    | "NECKLACE_SPECIAL_1"
    | "NECKLACE_SPECIAL_2";

/**
 * An item sprite
 */
export interface Sprite {
    /**
     * The string version of the items ID
     */
    id: MinecraftStringId,
    /**
     * The items' numeric ID
     */
    numericalId: number,
    /**
     * The items' damage value (data value)
     */
    damage: number
}

/**
 * Represents an Item from the API
 */
export class Item {
    private constructor(v: JSON);

    /**
     * The name of the item
     */
    public name: string;
    /**
     * The name of the item, as displayed in-game
     */
    public displayName: string;
    /**
     * The rarity of the item
     */
    public tier: ItemRarity;
    /**
     * The type of item
     */
    public type: ItemType;
    /**
     * The category of the item
     */
    public category: ItemCategory;
    /**
     * The set the item is part of, if any; currently,
     * this value is only used for the "LEAF" set
     */
    public set: string;
    /**
     * the visual sprite of the item; items using
     * mob heads (not player heads) will display
     * as `minecraft:leather_helmet` and no ItemSkin
     */
    public sprite: Sprite;
    /**
     * The armor color of the item
     */
    public color?: number[];
    /**
     * How this item can be obtained
     */
    public dropType: ItemDropType;
    /**
     * The lore of the item
     */
    public lore: string;
    /**
     * The restriction put on the item
     */
    public restriction: ItemRestriction;
    /**
     * Whether Craftsman characters can use the item
     */
    public craftsmanAllowed: boolean;
    /**
     * The stats of this item
     */
    public stats: ItemStats;
    /**
     * The requirements to use this item
     */
    public requirements: ItemRequirements;
    /**
     * The identifications of this item
     */
    public identifications: Identification[];
    /**
     * A list of this items major IDs
     */
    public majorIds: MajorId[];
    /**
     * The player head skin this item uses
     */
    public skin: ItemSkin;
    /**
     * Whether the item is pre-identified;
     * i.e. items bought from merchants
     */
    public identified: boolean;
}

/**
 * An item skin as found in the mojang API; this data does not update
 */
export interface ItemSkin {
    /**
     * The UUID of the player used for the skin;
     * only present on some skins
     */
    uuid?: string,
    /**
     * The name of the player used for the skin;
     * only present on some skins
     */
    name?: string,
    /**
     * The URL to the player skin
     */
    url: string
}

/**
 * A type of player class
 */
export type ClassType =
    | "ARCHER"
    | "ASSASSIN"
    | "DARK_WIZARD"
    | "HUNTER"
    | "KNIGHT"
    | "MAGE"
    | "NINJA"
    | "SHAMAN"
    | "SKYSEER"
    | "WARRIOR";

/**
 * Holds ClassLevelData for all levels on a class
 */
export interface ClassLevelsData {
    /**
     * The combat level of the class
     */
    combat: ClassLevelData,
    /**
     * The mining level of the class
     */
    mining: ClassLevelData,
    /**
     * The farming level of the class
     */
    farming: ClassLevelData,
    /**
     * The fishing level of the class
     */
    fishing: ClassLevelData,
    /**
     * The woodcutting level of the class
     */
    woodcutting: ClassLevelData,
    /**
     * The armoring level of the class
     */
    armoring: ClassLevelData,
    /**
     * The tailoring level of the class
     */
    tailoring: ClassLevelData,
    /**
     * The jeweling level of the class
     */
    jeweling: ClassLevelData,
    /**
     * The weaponsmithing level of the class
     */
    weaponsmithing: ClassLevelData,
    /**
     * The woodworking level of the class
     */
    woodworking: ClassLevelData,
    /**
     * The alchemism level of the class
     */
    alchemism: ClassLevelData,
    /**
     * The cooking level of the class
     */
    cooking: ClassLevelData,
    /**
     * The scribing level of the class
     */
    scribing: ClassLevelData
}

/**
 * Contains the information of one level
 */
export interface ClassLevelData {
    /**
     * The whole level
     */
    level: number,
    /**
     * The XP percentage, expressed as a number between 0 and 1
     */
    xp: number
}

/**
 * Represents a piece of repeatable content,
 * such as dungeons or raids, completed by a
 * player or class
 */
export interface RepeatableContent {
    /**
     * The name of content
     */
    name: string,
    /**
     * The amount the player or class completed the content
     */
    completed: number
}

/**
 * An object containing information on manually assigned class skill points
 */
export interface SkillPoints {
    /**
     * The Strength skill of the class
     */
    strength: number,
    /**
     * The Dexterity skill of the class
     */
    dexterity: number,
    /**
     * The Intelligence skill of the class
     */
    intelligence: number,
    /**
     * The Defence skill of the class
     */
    defence: number,
    /**
     * The Agility skill of the class
     */
    agility: number
}

/**
 * Holds information of class gamemodes
 */
export interface Gamemodes {
    /**
     * Whether the class is in Hardcore mode
     */
    hardcore: boolean,
    /**
     * Whether the class is in Ironman mode
     */
    ironman: boolean,
    /**
     * Whether the class is in Craftsman mode
     */
    craftsman: boolean,
    /**
     * Whether the class is in the Hunted gamemode;
     * does not reflect the player turning Hunted mode on
     */
    hunted: boolean
}

/**
 * Holds information on player or class PvP stats
 */
export interface PvpData {
    /**
     * The kills the player scored
     */
    kills: number,
    /**
     * The deaths the player suffered
     */
    deaths: number
}

/**
 * A staff rank on Wynncraft
 */
export type ServerRank =
    | "ADMINISTRATOR"
    | "MODERATOR"
    | "MEDIA"
    | "BUILDER"
    | "ITEM"
    | "GAME_MASTER"
    | "CMD"
    | "MUSIC"
    | "HYBRID"
    | "MEDIA";

/**
 * A donator rank on Wynncraft
 */
export type DonatorRank =
    | "CHAMPION"
    | "HERO"
    | "VIP+"
    | "VIP";

/**
 * Holds information about player ranks
 */
export interface RankData {
    /**
     * The players' server rank
     */
    serverRank: ServerRank,
    /**
     * The players' donator rank
     */
    donatorRank: DonatorRank,
    /**
     * Whether to display the players donator rank
     */
    displayDonatorRank: boolean,
    /**
     * Whether the player is a veteran
     * (bought a rank before first Minecraft EULA change)
     */
    veteran: boolean
}

/**
 * A rank in a guild
 */
export type GuildRank =
    | "OWNER"
    | "CHIEF"
    | "STRATEGIST"
    | "CAPTAIN"
    | "RECRUITER"
    | "RECRUIT";

/**
 * Holds information about a players Guild
 */
export interface PlayerGuildData {
    /**
     * The name of the players Guild
     */
    name: string,
    /**
     * The players rank in the Guild
     */
    rank: GuildRank,
    /**
     * Returns the API object of the Guild
     */
    fetch(): Promise<Guild>
}

/**
 * Holds total level data
 */
export interface PlayerLevelsData {
    /**
     * The combined combat level of the player
     */
    combat: number,
    /**
     * The combined profession level of the player
     */
    profession: number,
    /**
     * The combined total level of the player
     */
    combined: number
}

/**
 * Represents a class of a player
 */
export class PlayerClass {
    private constructor(data: any);

    /**
     * The name of the class
     */
    public name: string;
    /**
     * The type of class
     */
    public type: ClassType;
    /**
     * The combined level of the class; contrary to
     * the API, this includes level 1 of professions
     */
    public totalLevel: number;
    /**
     * The level in professions and combat of the class
     */
    public levels: ClassLevelsData;
    /**
     * A list of all Quests completed on this class
     */
    public quests: string[];
    /**
     * A list of all dungeons completed on this class;
     * ordered in ascending order of first completion
     */
    public dungeons: RepeatableContent[];
    /**
     * A list of all raids completed on this class;
     * ordered in ascending order of first completion
     */
    public raids: RepeatableContent[];
    /**
     * The manually assigned skillpoints of the class
     */
    public skillPoints: SkillPoints;
    /**
     * The gamemodes of the class
     */
    public gamemodes: Gamemodes;
    /**
     * The PvP stats of the class
     */
    public pvp: PvpData;
    /**
     * The playtime on this class
     */
    public playtime: number;
    /**
     * The amount of items identified on this class,
     * the statistic is currently unused
     */
    public itemsIdentified: number;
    /**
     * The amount of mobKills on this class
     */
    public mobsKilled: number;
    /**
     * The amount of chests opened on this class
     */
    public chestsOpened: number;
    /**
     * The amount of logins on this class
     */
    public logins: number;
    /**
     * The amount of deaths on this class
     */
    public deaths: number;
    /**
     * The amount of blocks travelled by this class;
     * also counts teleportation; overflows like a
     * 32-bit Integer
     */
    public blocksWalked: number;
    /**
     * The total amount of discoveries on this class;
     * also counts removed discoveries
     */
    public discoveries: number;
    /**
     * The amount of swarms won on this class
     */
    public eventsWon: number;
    /**
     * Whether this class has reached combat level 101
     * before the Economy Update 1.18 released; classes
     * with this flag display a star next to their level
     */
    public hasEconomyStar: boolean;
}

/**
 * Holds information on the player's leaderboard rankings
 */
export interface PlayerRankings {
    /**
     * The ranking of the players' Guild;
     * currently unused
     */
    guild: number,
    /**
     * The PvP ranking of the player;
     * currently unused
     */
    pvp: number,
    /**
     * The level rankings of the player
     */
    player: PlayerPersonalRankings
}

/**
 * A players' level rankings
 */
export interface PlayerPersonalRankings {
    /**
     * The level rankings for combined levels
     */
    combined: PlayerPersonalCombinedRankings,
    /**
     * The level rankings for single class levels
     */
    solo: PlayerPersonalSoloRankings
}

/**
 * A players' combined level rankings
 */
export interface PlayerPersonalCombinedRankings {
    /**
     * Position in the leaderboard of combined total level,
     * counting combat and profession across all classes
     */
    all: number,
    /**
     * Position in the leaderboard of combat level,
     * counting combat across all classes
     */
    combat: number,
    /**
     * Position in the leaderboard of profession level,
     * counting profession across all classes
     */
    profession: number
}

/**
 * A players' single class level rankings
 */
export interface PlayerPersonalSoloRankings {
    /**
     * Position in the leaderboard of total level,
     * counting the total level of their highest
     * levelled class
     */
    all: number,
    /**
     * Position in the leaderboard of combat level,
     * counting the combat level of their highest
     * levelled combat class
     */
    combat: number,
    /**
     * Position in the leaderboard of profession level,
     * counting the profession level of their highest
     * levelled profession class
     */
    profession: number,
    /**
     * Position in the leaderboard of mining level,
     * counting the mining level of their highest
     * levelled mining class
     */
    mining: number,
    /**
     * Position in the leaderboard of farming level,
     * counting the farming level of their highest
     * levelled farming class
     */
    farming: number,
    /**
     * Position in the leaderboard of fishing level,
     * counting the fishing level of their highest
     * levelled fishing class
     */
    fishing: number,
    /**
     * Position in the leaderboard of woodcutting level,
     * counting the woodcutting level of their highest
     * levelled woodcutting class
     */
    woodcutting: number,
    /**
     * Position in the leaderboard of armoring level,
     * counting the armoring level of their highest
     * levelled armoring class
     */
    armoring: number,
    /**
     * Position in the leaderboard of tailoring level,
     * counting the tailoring level of their highest
     * levelled tailoring class
     */
    tailoring: number,
    /**
     * Position in the leaderboard of jeweling level,
     * counting the jeweling level of their highest
     * levelled jeweling class
     */
    jeweling: number,
    /**
     * Position in the leaderboard of woodworking level,
     * counting the woodworking level of their highest
     * levelled woodworking class
     */
    woodworking: number,
    /**
     * Position in the leaderboard of weaponsmithing level,
     * counting the weaponsmithing level of their highest
     * levelled weaponsmithing class
     */
    weaponsmithing: number,
    /**
     * Position in the leaderboard of alchemism level,
     * counting the alchemism level of their highest
     * levelled alchemism class
     */
    alchemism: number,
    /**
     * Position in the leaderboard of cooking level,
     * counting the cooking level of their highest
     * levelled cooking class
     */
    cooking: number,
    /**
     * Position in the leaderboard of scribing level,
     * counting the scribing level of their highest
     * levelled scribing class
     */
    scribing: number
}

/**
 * Represents a player from the API
 */
export class Player extends BaseAPIObject {
    private constructor(data: JSON, params: JSON);

    /**
     * The account name of the player
     */
    public name: string;
    /**
     * The UUID of the player
     */
    public uuid: string;
    /**
     * The rank data of the player
     */
    public rank: RankData;
    /**
     * The first join of the player, as a Date
     */
    public firstJoin: Date;
    /**
     * The first join of the player, as a unix timestamp
     */
    public firstJoinTimestamp: number;
    /**
     * The last join of the player, as a Date
     */
    public lastJoin: Date;
    /**
     * The last join of the player, as a unix timestamp
     */
    public lastJoinTimestamp: number;
    /**
     * The playtime of the player; this value is
     * roughly equal to one fifth of the players
     * playtime in hours
     */
    public playtime: number;
    /**
     * The current world of the player, null if offline
     */
    public world: string;
    /**
     * The guild data of the player
     */
    public guild: PlayerGuildData;
    /**
     * The total levels of the player
     */
    public totalLevel: PlayerLevelsData;
    /**
     * The PvP stats of the player
     */
    public pvp: PvpData;
    /**
     * The classes of the player
     */
    public classes: PlayerClass[];
    /**
     * The total chest count of the player
     */
    public chestsOpened: number;
    /**
     * The total amount of blocks travelled by
     * the player, also counts teleportation,
     * overflows like a 32-bit Integer
     */
    public blocksWalked: number;
    /**
     * The total amount of items identified;
     * this statistic is not being updated
     */
    public itemsIdentified: number;
    /**
     * The total amount of mobKills
     */
    public mobsKilled: number;
    /**
     * The total amount of logins
     */
    public logins: number;
    /**
     * The total amount of deaths
     */
    public deaths: number;
    /**
     * The total amount of discoveries;
     * includes duplicates;
     * includes removed discoveries
     */
    public discoveries: number;
    /**
     * The total amount of swarms won
     */
    public eventsWon: number;
    /**
     * The leaderboard rankings of the player in all levels;
     * null if not in top #100;
     * rankings do not display any values if the
     * player name is mispelled in the request
     */
    public ranking: PlayerRankings;
}

/**
 * A color as used by Minecraft
 */
export type MinecraftColor =
    | "WHITE"
    | "LIGHT_GRAY"
    | "GRAY"
    | "BLACK"
    | "LIME"
    | "GREEN"
    | "CYAN"
    | "LIGHT_BLUE"
    | "BLUE"
    | "YELLOW"
    | "ORANGE"
    | "PINK"
    | "RED"
    | "MAGENTA"
    | "PURPLE"
    | "BROWN"

/**
 * A banner pattern as defined by Minecraft
 */
export type BannerPattern =
    | "bs" // Bottom Stripe
    | "ts" // Top Stripe
    | "ls" // Left Stripe
    | "rs" // Right Stripe
    | "ms" // Middle Stripe
    | "cs" // Center Stripe
    | "drs" // Down Right Stripe
    | "dls" // Down Right 
    | "ss" // Small Stripes
    | "cr" // Diagonal Cross
    | "sc" // Square Cross
    | "ld" // Top Left Triangle
    | "rud" // Top Right Triangle
    | "lud" // Bottom Left Triangle
    | "rd" // Bottom Right Triangle
    | "vh" // Vertical Half Left
    | "vhr" // Vertical Half Right
    | "hh" // Horizontal Half Top
    | "hhb" // Horizontal Half Bottom
    | "bl" // Bottom Left Corner
    | "br" // Bottom Right Corner
    | "tl" // Top Left Corner
    | "tr" // Top Right Corner
    | "bt" // Bottom Triangle
    | "tt" // Top Triangle
    | "bts" // Bottom Triangle Sawtooth
    | "tts" // Top Triangle Sawtooth
    | "mc" // Middle Circle
    | "mr" // Middle Rombus
    | "bo" // Border
    | "cbo" // Curly Border
    | "bri" // Bricks
    | "gra" // Gradient
    | "gru" // Gradient Upside-Down
    | "cre" // Creeper
    | "sku" // Skull
    | "flo" // Flower
    | "moj" // Mojang Logo
    | "glb" // Globe
    | "pig"; // Piglin Snoute

/**
 * A banner layer with a pattern and color
 */
export interface BannerLayer {
    /**
     * The layers pattern
     */
    pattern: BannerPattern,
    /**
     * The layers color
     */
    color: MinecraftColor
}

/**
 * An object containing all data for a banner
 */
export interface BannerData {
    /**
     * The highest unlocked regular tier of the banner
     */
    highestUnlockedTier: number,
    /**
     * The currently used banner structure
     */
    activeStructure: string,
    /**
     * The base color of the banner
     */
    baseColor: MinecraftColor,
    /**
     * The banner layers
     */
    layers: BannerLayer[]
}

/**
 * Represents a member of a guild
 */
export class GuildMember {
    private constructor(v: JSON);

    /**
     * The name of the guild member
     */
    public name: string;
    /**
     * The uuid of the guild member
     */
    public uuid: string;
    /**
     * The rank of the guild member
     */
    public rank: GuildRank;
    /**
     * The join date of the guild member
     */
    public joined: Date;
    /**
     * The join date of the guild member as a unix timestamp
     */
    public joinedTimestamp: number;
    /**
     * The amount of XP contributed by the guild member
     */
    public xp: number;
    /**
     * The current world the player is online on, if any;
     * only set if `fetchAdditionalStats=true`
     * in the request options;
     * if two members of a guild are online on the same
     * world, this value refers to the same object
     */
    public world?: World;

    /**
     * Fetches the player stats of the guild member
     */
    public fetch(): Promise<Player>;
}

/**
 * Represents a guild as from the API
 */
export class Guild extends BaseAPIObject {
    private constructor(data: JSON, params: JSON);

    /**
     * The name of the guild
     * @readonly
     */
    public name: string;
    /**
     * The tag of the guild
     */
    public tag: string;
    /**
     * Indicates whether the object has the data returned by the
     * `fetchAdditionalStats=true` request option; used to
     * determine whether `fetchAdditionalStats()` has an effect
     */
    public hasAdditionalStats: boolean;
    /**
     * The level of the guild
     */
    public level: number;
    /**
     * The xp percentage of the 1.19 requirement of the
     * guilds current level as a number between 0 and 1;
     * calculates like `current_xp / requirement_1_19`;
     * use `gavel-gateway-js.data.guildLevels` to trans-
     * late the percentage to 1.20 values or percentage
     */
    public xp: number;
    /**
     * The creation date of the guild
     */
    public created: Date;
    /**
     * The creation date of the guild as a unix timestamp
     */
    public createdTimestamp: number;
    /**
     * The amount of territories the guild currently
     * holds; if `fetchAdditionalStats=true`, this
     * is an array of Territory objects instead
     */
    public territories: number | Territory[];
    /**
     * The members of the guild
     */
    public members: GuildMember[];
    /**
     * The banner data of the guild
     */
    public banner: BannerData;

    /**
     * Mutates the object as if the fetchAdditionalStats
     * property was `true` when this guild was requested
     */
    public fetchAdditionalStats(options: RequestOptions): Promise<Guild>;
}

/**
 * Represents an ingredient from the API
 */
export class Ingredient {
    private constructor(v: JSON);

    /**
     * The name of the ingredient
     */
    public name: string;
    /**
     * The name of the ingredient as it shows up in-game
     */
    public displayName: string;
    /**
     * The tier of the ingredient
     */
    public tier: number;
    /**
     * The minimum level of recipe required to use the ingredient
     */
    public level: number;
    /**
     * The crafting professions this ingredient can be used for
     */
    public skills: CraftingSkill[];
    /**
     * The visual sprite this ingredient uses
     */
    public sprite: Sprite;
    /**
     * The identifications of the ingredient
     */
    public identifications: Identification[];
    /**
     * The restricted ID modifiers of the ingredient
     */
    public restrictedIds: RestrictedIdModifiers;
    /**
     * The crafting grid position modifiers
     */
    public positionModifiers: PositionModifiers
}

/**
 * The crafting grid position modifiers of an ingredient
 */
export interface PositionModifiers {
    /**
     * The ID modifier to ingredients placed to the left of the ingredient
     */
    left: number,
    /**
     * The ID modifier to ingredients placed to the right of the ingredient
     */
    right: number,
    /**
     * The ID modifier to ingredients placed above the ingredient
     */
    above: number,
    /**
     * The ID modifier to ingredients placed below the ingredient
     */
    under: number,
    /**
     * The ID modifier to ingredients touching the ingredient
     */
    touching: number,
    /**
     * The ID modifier to ingredients not touching the ingredient
     */
    notTouching: number
}

/**
 * The IDs only effective on certain types of crafted items
 */
export interface RestrictedIdModifiers {
    /**
     * The durability modifier, only applies to non-consumable items
     */
    durability: number,
    /**
     * The strength requirement modifier,
     * only applies to non-consumable items
     */
    strengthRequirement: number,
    /**
     * The dexterity requirement modifier,
     * only applies to non-consumable items
     */
    dexterityRequirement: number,
    /**
     * The intelligence requirement modifier,
     * only applies to non-consumable items
     */
    intelligenceRequirement: number,
    /**
     * The defence requirement modifier,
     * only applies to non-consumable items
     */
    defenceRequirement: number,
    /**
     * The agility requirement modifier,
     * only applies to non-consumable items
     */
    agilityRequirement: number,
    /**
     * The attack speed modifier,
     * only applies to weapons
     */
    attackSpeed: number,
    /**
     * The powder slot modifier,
     * only applies to armor and weapons
     */
    powderSlots: number,
    /**
     * The duration modifier,
     * only applies to consumables
     */
    duration: number,
    /**
     * The charges modifier,
     * only applies to consumables
     */
    charges: number
}

/**
 * A singular identification
 */
export interface Identification {
    /**
     * The name of the identification
     */
    name: IdentificationName,
    /**
     * The base value for the identification; only present on items
     */
    base?: number,
    /**
     * The minimal value of the identification's roll
     */
    min: number,
    /**
     * The maximum value of the identification's roll
     */
    max: number
}

/**
 * Stats for items,
 * weapon stats are only set on weapons,
 * armor stats are only set on armor
 */
export interface ItemStats {
    /**
     * The powderslots of the item
     */
    powderSlots: number,
    /**
     * The health of the armor piece
     */
    health: number,
    /**
     * The earth defence of the armor piece or accessory
     */
    earthDefence: number,
    /**
     * The thunder defence of the armor piece or accessory
     */
    thunderDefence: number,
    /**
     * The water defence of the armor piece or accessory
     */
    waterDefence: number,
    /**
     * The fire defence of the armor piece or accessory
     */
    fireDefence: number,
    /**
     * The air defence of the armor piece or accessory
     */
    airDefence: number,
    /**
     * The neutral damage of the weapon
     */
    damage: Range,
    /**
     * The earth damage of the weapon
     */
    earthDamage: Range,
    /**
     * The thunder damage of the weapon
     */
    thunderDamage: Range,
    /**
     * The water damage of the weapon
     */
    waterDamage: Range,
    /**
     * The fire damage of the weapon
     */
    fireDamage: Range,
    /**
     * The air damage of the weapon
     */
    airDamage: Range,
    /**
     * The attack speed of the weapon
     */
    attackSpeed: AttackSpeed
}

/**
 * Requirements to use an item
 */
export interface ItemRequirements {
    /**
     * The minimum combat level required to use the item
     */
    level: number,
    /**
     * The optional quest required to use the item
     */
    quest: string,
    /**
     * The class required to use the item,
     * always the non-donator class,
     * is currently never set on weapons
     */
    class: ClassType,
    /**
     * The strength requirement to use the item
     */
    strength: number,
    /**
     * The dexterity requirement to use the item
     */
    dexterity: number,
    /**
     * The intelligence requirement to use the item
     */
    intelligence: number,
    /**
     * The defence requirement to use the item
     */
    defence: number,
    /**
     * The agility requirement to use the item
     */
    agility: number
}

/**
 * A material to be used while crafting an item
 */
export interface CraftingMaterial {
    /**
     * The material name
     */
    item: string,
    /**
     * The amount required
     */
    amount: number
}

/**
 * A recipe from the API
 */
export class Recipe {
    private constructor(v: JSON);

    /**
     * The ID of the recipe
     */
    public id: string;
    /**
     * The type of the resulting item
     */
    public type: CraftableItemType;
    /**
     * The required crafting skill
     */
    public skill: CraftingSkill
    /**
     * The level range the resulting item may be in
     */
    public level: Range;
    /**
     * The required materials to craft the item
     */
    public materials: CraftingMaterial[];
    /**
     * The health of the resulting armor piece
     */
    public health?: Range;
    /**
     * The damage of the resulting weapon
     */
    public damage?: Range;
    /**
     * The durability of the resulting weapon, armor piece or accessory
     */
    public durability?: Range;
    /**
     * The duration of the resulting consumable
     */
    public duration?: Range;
    /**
     * The duration of the consumable if no ingredients are used
     */
    public basicDuration?: Range;
}

/**
 * A rectangular area
 */
export interface SquareRegion {
    /**
     * The bounds of the region on the X-axis
     */
    x: Range,
    /**
     * The bounds of the region on the Z-axis
     */
    z: Range
}

/**
 * A territory resource production
 */
export interface Resources {
    /**
     * The amount of emeralds the territory produces
     */
    emeralds: number,
    /**
     * The amount of ore the territory produces
     */
    ore: number,
    /**
     * The amount of crops the territory produces
     */
    crops: number,
    /**
     * The amount of wood the territory produces
     */
    wood: number,
    /**
     * The amount of fish the territory produces
     */
    fish: number
}

/**
 * Represents a Territory from the API
 */
export class Territory {
    private constructor(v: JSON);

    /**
     * The name of the territory
     */
    public territory: string;
    /**
     * The name of the guild holding the territory
     */
    public guild: string;
    /**
     * The attacker of the territory; currently unused
     */
    public attacker: string;
    /**
     * The time the territory was acquired
     */
    public acquired: Date;
    /**
     * The time the territory was acquired as a unix timestamp
     */
    public acquiredTimestamp: number;
    /**
     * The location and dimensions of the territory
     */
    public location: SquareRegion;
    /**
     * The amount of resources produced by the territory
     * at base production; fetched from local data
     */
    public resources: Resources;
    /**
     * The territories connected to the territory
     */
    public connections: Territory[];

    /**
     * Fetches the guild stats of the owner guild
     */
    public fetchOwner(): Promise<Guild>;
}

/**
 * Represents a player in a leaderboard from the API
 */
export class LeaderboardPlayer {
    private constructor(v: JSON);

    /**
     * The account name of the player
     */
    public name: string;
    /**
     * The UUID of the player
     */
    public uuid: string;
    /**
     * The rank information of the player;
     * the `displayTag` and `veteran` properties
     * are currently always false, unless
     * both are true
     */
    public rank: RankData;
    /**
     * The playtime of the player
     */
    public playtime: number;
    /**
     * The ClassType that earns the player their spot on the
     * leaderboard; only set if the requested scope was `SOLO`
     */
    public class?: ClassType;
    /**
     * The respective level of the player; only
     * set if the type of the request wasn't `PVP`
     */
    public level?: string;
    /**
     * The additional XP the player has gathered beyond their current
     * level; only set if the type of the request wasn't `PVP`
     */
    public xp?: number;
    /**
     * The nether kills of the player; only set
     * if the type of the request was `PVP`
     */
    public kills?: number;

    /**
     * Fetches the player stats of the player
     */
    fetchPlayer(): Promise<Player>;
}

/**
 * Represents a guild in a leaderboard from the API
 */
export class LeaderboardGuild {
    private constructor(v: JSON);

    /**
     * The name of the guild
     */
    public name: string;
    /**
     * The tag of the guild
     */
    public tag: string;
    /**
     * The level of the guild
     */
    public level: number;
    /**
     * The current raw xp of the guild
     */
    public xp: number;
    /**
     * The creation time of the guild
     */
    public created: Date;
    /**
     * The creation time of the guild as a unix timestamp
     */
    public createdTimestamp: number;
    /**
     * The banner of the guild
     */
    public banner: BannerData;
    /**
     * The member count of the guild
     */
    public members: number;
    /**
     * The territory count of the guild
     */
    public territories: number;
    /**
     * The war count of the guild; counts all war attempts
     */
    public warCount: number;

    /**
     * Fetches the stats of the guild
     */
    fetch(): Promise<Guild>;
}

/**
 * A server type found on Wynncraft
 */
export type WorldType =
    | "WYNNCRAFT"
    | "MEDIA"
    | "OTHER";

/**
 * Represents a world or server on Wynncraft
 */
export class World {
    private constructor(v: JSON);
    /**
     * The identifier of the world
     */
    public name: string;
    /**
     * The type of the world
     */
    public worldType: WorldType;
    /**
     * An array of player names who are online on the world;
     * sorted in ascending order of login time
     */
    public players: string[];
}

/**
 * Represents a list of values
 */
export class List<T> extends BaseAPIObject {
    private constructor(arr: T[], params: JSON);

    /**
     * The entries in the list
     */
    public list: T[];
}

/**
 * Represents the sum of online players on Wynncraft
 */
export class OnlinePlayersSum extends BaseAPIObject {
    private constructor(data: JSON, params: JSON);

    /**
     * The amount of players currently online on Wynncraft
     */
    public players: number;
}
