
/**
 * Returns information on the ratelimit channels
 * @category Util
 */
export function ratelimit(): Ratelimit

/**
 * Merges the given options into the config and returns a copy of the full config
 * @param config A ConfigOptions object containing all settings to be set
 * @category Util
 */
export function setConfig(config?: ConfigOptions): Config

/**
 * Removes all stored entries from cache and returns the amount of entries
 * cleared
 * @category Util
 */
export function flushCache(): number

/**
 * Returns a raw API response of the requested route
 * <div class="noteBox important" style="display:flex">
 *     <img src="../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * @param options The options for the request, or a route to request
 * @category Endpoint
 */
export function fetchRaw(options: RawRequestOptions | WynncraftAPIRoute): Promise<any>

/**
 * Fetches a player from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * <div class="noteBox note" style="display:flex">
 *     <img src="../assets/note.png", class="noteBoxIcon">This function returns <code>null</code> if the player has never logged into Wynncraft.
 * </div>
 * @param options The options for the request, or a player name or uuid
 * @category Endpoint
 */
export function fetchPlayer(options: PlayerRequestOptions | string): Promise<Player?>

/**
 * Fetches the player leaderboard from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * <div class="noteBox note" style="display:flex">
 *     <img src="../assets/note.png", class="noteBoxIcon">The list is ordered in ascending order of position. (first place at start)
 * </div>
 * @param options The options for the request; or a type of `TOTAL` leaderboard to request
 * @category Endpoint
 */
export function fetchPlayerLeaderboard(options?: PlayerLeaderboardRequestOptions | PlayerTotalLeaderboardType): Promise<List<LeaderboardPlayer>>

/**
 * Fetches a guild from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * <div class="noteBox note" style="display:flex">
 *     <img src="../assets/note.png", class="noteBoxIcon">This function returns <code>null</code> if the guild doesn't exist.
 * </div>
 * @param options The options for the request, or a guild name to request
 * @category Endpoint
 */
export function fetchGuild(options: GuildRequestOptions | string): Promise<Guild?>

/**
 * Fetches all guild names from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * <div class="noteBox note" style="display:flex">
 *     <img src="../assets/note.png", class="noteBoxIcon">The list is ordered in ascending order of creation.
 * </div>
 * @param options The options for the request
 * @category Endpoint
 */
export function fetchGuildList(options?: RequestOptions): Promise<List<string>>

/**
 * Fetches the guild leaderboard from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * <div class="noteBox note" style="display:flex">
 *     <img src="../assets/note.png", class="noteBoxIcon">The list is ordered in ascending order of position. (first place at start)
 * </div>
 * @param options The options for the request
 * @category Endpoint
 */
export function fetchGuildLeaderboard(options?: RequestOptions): Promise<List<LeaderboardGuild>>

/**
 * Fetches the territory list from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * @param options The options for the request
 * @category Endpoint
 */
export function fetchTerritoryList(options?: RequestOptions): Promise<List<Territory>>

/**
 * Fetches all ingredients matching the options from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * <div class="noteBox tip" style="display:flex">
 *     <img src="../assets/tip.png", class="noteBoxIcon">You should never disable caching for this function. Disabling caching or setting low cache times will result in multiple MB of network traffic on every call.
 * </div>
 * @param options The options for the request, or a partial display name to search for
 * @category Endpoint
 */
export function fetchIngredients(options?: IngredientSearchRequestOptions | string): Promise<List<Ingredient>>

/**
 * Fetches all ingredient names from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * @param options The options for the request
 * @category Endpoint
 */
export function fetchIngredientList(options?: RequestOptions): Promise<List<string>>

/**
 * Fetches all recipes matching the options from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * <div class="noteBox tip" style="display:flex">
 *     <img src="../assets/tip.png", class="noteBoxIcon">You should never disable caching for this function. Disabling caching or setting low cache times will result in multiple MB of network traffic on every call.
 * </div>
 * @param options The options for the request, or a recipe ID
 * @category Endpoint
 */
export function fetchRecipes(options?: RecipeSearchRequestOptions | string): Promise<List<Recipe>>

/**
 * Fetches all recipe names from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * @param options The options for the request
 * @category Endpoint
 */
export function fetchRecipeList(options?: RequestOptions): Promise<List<string>>

/**
 * Fetches all items matching the options from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * <div class="noteBox tip" style="display:flex">
 *     <img src="../assets/tip.png", class="noteBoxIcon">You should never disable caching for this function. Disabling caching or setting low cache times will result in multiple MB of network traffic on every call.
 * </div>
 * @param options The options for the request, or a partial display name to search for
 * @category Endpoint
 */
export function fetchItems(options?: ItemSearchRequestOptions | string): Promise<List<Item>>

/**
 * Fetches the online players from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * @param options The options for the request
 * @category Endpoint
 */
export function fetchOnlinePlayers(options?: RequestOptions): Promise<List<World>>

/**
 * Fetches the number of online players from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * @param options The options for the request
 * @category Endpoint
 */
export function fetchOnlinePlayersSum(options?: RequestOptions): Promise<OnlinePlayersSum>

/**
 * Fetches the guild and player names matching this query from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * @param options The options for the request, or a string to search for
 * @category Endpoint
 */
export function fetchNames(options: NameSearchRequestOptions | string): Promise<NameSearch>

/**
 * Fetches the coordinates of important locations from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * @param options The options for the request
 * @category Endpoint
 */
export function fetchMapLocations(options: RequestOptions): Promise<List<MapLocation>>

/**
 * Fetches the coordinates and health info for the locally logged in player from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * <div class="noteBox note" style="display:flex">
 *     <img src="../assets/note.png", class="noteBoxIcon">Which player to return info for is based on the IP used to cast this request and the IP logged into the Minecraft server.
 * </div>
 * @param options The options for the request
 * @category Endpoint
 */
export function fetchMyLocation(options: RequestOptions): Promise<PlayerParty>

/**
 * A collection of static data that is used within
 * the library, but can also be used externally
 */
export var data: LocalData

/**
 * A collection of static data that is used within
 * the library
 */
export interface LocalData {
    /**
     * Information on Identifications
     */
    identifications: IdentificationData[],
    /**
     * Information on Major IDs
     */
    majorIds: MajorIdData[],
    /**
     * A translation table for string and numeric minecraft IDs
     */
    minecraftIds: MinecraftIds,
    /**
     * Information on Territories
     */
    territories: Map<string, TerritoryData>,
    /**
     * Information on sprites commonly used by wynncraft items
     * <div class="noteBox note" style="display:flex">
     *     <img src="../assets/note.png", class="noteBoxIcon">Not all sprites are listed here. Ingredient sprites and some special items (currently only "Wybel Paw") don't use sprites from here.
     * </div>
     */
    sprites: Map<ItemSpriteName, Sprite>,
    /**
     * Information on guild level requirements; the preGavelReborn is the value
     * for a guild to level up from the given level to the next, prior to 1.20;
     * postGavelReborn is it's equivalent for post 1.20
     * <div class="noteBox tip" style="display:flex">
     *     <img src="../assets/tip.png", class="noteBoxIcon">You can use this data to translate the level percentage returned by the guild API endpoint.
     * </div>
     * <div class="noteBox note" style="display:flex">
     *     <img src="../assets/note.png", class="noteBoxIcon">The array index represents the level.
     * </div>
     */
    guildLevels: GuildLevelRequirementData[]
}

/**
 * Information to translate raw identification API data to wrapped data
 */
export interface IdentificationData {
    /**
     * The name the wrapper uses
     */
    name: IdentificationName,
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
    name: MajorId,
    /**
     * The name of the Major ID in the API
     */
    apiName: string,
    /**
     * The name of the Major ID as it shows up in-game
     * <div class="noteBox warning" style="display:flex">
     *     <img src="../assets/warning.png", class="noteBoxIcon">This is only set after items have been requested once.
     * </div>
     */
    inGameName?: string,
    /**
     * The description of the Major ID as it shows up in-game
     * <div class="noteBox warning" style="display:flex">
     *     <img src="../assets/warning.png", class="noteBoxIcon">This is only set after items have been requested once.
     * </div>
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
 * Information on guild level requirements
 */
export interface GuildLevelRequirementData {
    /**
     * The amount of XP required to level to the next level
     * before 1.20 - Gavel Reborn
     * <div class="noteBox note" style="display:flex">
     *     <img src="../assets/note.png", class="noteBoxIcon">Values above level 87 are just approximations.
     * </div>
     */
    preGavelReborn: number,
    /**
     * The amount of XP required to level to the next level
     * after 1.20 - Gavel Reborn
     */
    postGavelReborn: number
}

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
 * The base options for a generic API request
 */
export interface RequestOptions {
    /**
     * The API key to use in this request
     * <div class="noteBox important" style="display:flex">
     *     <img src="../../assets/important.png", class="noteBoxIcon">The key has to be registered in the config.
     * </div>
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">If this is not given, the registered key with the most free requests will be selected.
     * </div>
     */
    apiKey?: string,
    /**
     * Whether to allow this request to pull from cache if available
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
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon"><div>This only applies to {@link fetchRaw | fetchRaw}.</div>
     * </div>
     * @default 30000
     */
    cacheFor?: number,
    /**
     * Whether to ignore version errors
     * <div class="noteBox tip" style="display:flex">
     *     <img src="../../assets/tip.png", class="noteBoxIcon">You can use this to resolve temporary conflicts while the library awaits being updated. Otherwise it should stay enabled.
     * </div>
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
    route: WynncraftAPIRoute
    /**
     * Whether requests to the same route should be allowed to be stacked, see {@link Config.allowStackingByDefault}
     * <div class="noteBox important" style="display:flex">
     *     <img src="../../assets/important.png", class="noteBoxIcon">Stacked requests only use a single API request and return the EXACT same object as all other requests in the stack.
     * </div>
     * <div class="noteBox warning" style="display:flex">
     *     <img src="../../assets/warning.png", class="noteBoxIcon">Keeping this enabled can cause errors if requested data is mutated in downstream code
     * </div>
     */
    allowStacking?: boolean,
    /**
     * Whether errors or profiles not being found should be
     * filtered out and throw errors/return `null`
     * @default true
     */
    interpret?: boolean
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
     * The scope of the leaderboard; TOTAL means all classes, SOLO means single class
     * @default "TOTAL"
     */
    scope?: PlayerLeaderboardScope,
    /**
     * The type of level or levels to rank
     * <div class="noteBox tip" style="display:flex">
     *     <img src="../../assets/tip.png", class="noteBoxIcon">Make sure the type is a type in the selected scope.
     * </div>
     * @default "COMBAT"
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
     * information
     * <div class="noteBox important" style="display:flex">
     *     <img src="../../assets/important.png", class="noteBoxIcon">This may cause extra API requests.
     * </div>
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
     * string in their name
     * @case-insensitive
     */
    name?: string,
    /**
     * Only match ingredients containing this string in
     * their name as displayed in-game
     * @case-insensitive
     */
    displayName?: string,
    /**
     * Only match ingredients of this tier
     * <div class="noteBox tip" style="display:flex">
     *     <img src="../../assets/tip.png", class="noteBoxIcon"><div>Values have to be integers between 0 and 3 and the {@link OpenRange | Range} has to have at least one bound.</p>
     * </div>
     */
    tier?: OpenRange | number,
    /**
     * Only match ingredients of this level
     * <div class="noteBox tip" style="display:flex">
     *     <img src="../../assets/tip.png", class="noteBoxIcon"><div>Values have to be integers and the {@link OpenRange | Range} has to have at least one bound.</p>
     * </div>
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
     * Only match ingredients with these identifications
     */
    identifications?: IdentificationQuery,
    /**
     * Only match ingredients with these restricted identifications
     */
    restrictedIds?: RestrictedIdQuery
    /**
     * Only match ingredients with these positional modifiers
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
     * Only match recipes within this level range
     * <div class="noteBox tip" style="display:flex">
     *     <img src="../../assets/tip.png", class="noteBoxIcon"><p>Values have to be integer, and {@link OpenRange | Ranges} have to have at least one bound.</p>
     * </div>
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
     * Only match recipes if their durability lies within this range
     * <div class="noteBox tip" style="display:flex">
     *     <img src="../../assets/tip.png", class="noteBoxIcon"><p>Values have to be integer, and {@link OpenRange | Ranges} have to have at least one bound.</p>
     * </div>
     */
    durability?: OpenRange,
    /**
     * Only match recipes if their duration lies within this range
     * <div class="noteBox tip" style="display:flex">
     *     <img src="../../assets/tip.png", class="noteBoxIcon"><p>Values have to be integer, and {@link OpenRange | Ranges} have to have at least one bound.</p>
     * </div>
     */
    duration?: OpenRange,
    /**
     * Only match recipes if their basic duration lies within this range
     * <div class="noteBox tip" style="display:flex">
     *     <img src="../../assets/tip.png", class="noteBoxIcon"><p>Values have to be integer, and {@link OpenRange | Ranges} have to have at least one bound.</p>
     * </div>
     */
    basicDuration?: OpenRange,
    /**
     * Only match recipes if their health lies within this range
     * <div class="noteBox tip" style="display:flex">
     *     <img src="../../assets/tip.png", class="noteBoxIcon"><p>Values have to be integer, and {@link OpenRange | Ranges} have to have at least one bound.</p>
     * </div>
     */
    health?: OpenRange,
    /**
     * Only match recipes if their damage lies within this range
     * <div class="noteBox tip" style="display:flex">
     *     <img src="../../assets/tip.png", class="noteBoxIcon"><p>Values have to be integer, and {@link OpenRange | Ranges} have to have at least one bound.</p>
     * </div>
     */
    damage?: OpenRange
}

/**
 * The options for an item API request
 */
export interface ItemSearchRequestOptions extends RequestOptions {
    /**
     * Only match items containing this string in their `name`
     * <div class="noteBox tip" style="display:flex">
     *     <img src="../../assets/tip.png", class="noteBoxIcon">Use the displayName filter for names as shown in-game.
     * </div>
     * @case-insensitive
     */
    name?: string,
    /**
     * Only match items containing this string in their `displayName`
     * @case-insensitive
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
     * Only match items that are part of this set
     * <div class="noteBox warning" style="display:flex">
     *     <img src="../../assets/warning.png", class="noteBoxIcon">This property is currently only used by the `LEAF` set.
     * </div>
     */
    set?: string,
    /**
     * Only match items using this visual sprite
     */
    sprite?: SpriteQuery | MinecraftId,
    /**
     * Only match items using this color
     * <div class="noteBox tip" style="display:flex">
     *     <img src="../../assets/tip.png", class="noteBoxIcon">The array must be of length 3 and contain only integers between 0 and 255.
     * </div>
     */
    color?: number[],
    /**
     * Only match items obtained from this source
     */
    dropType?: ItemDropType,
    /**
     * Only match items containing this string in their lore
     * @case-insensitive
     */
    lore?: string,
    /**
     * Only match items with this restriction
     * <div class="noteBox tip" style="display:flex">
     *     <img src="../../assets/tip.png", class="noteBoxIcon">Use <code>null</code> to search for items without any restrictions.
     * </div>
     */
    restriction?: ItemRestriction,
    /**
     * Only match items that match the requirement query
     */
    requirements?: ItemRequirementQuery,
    /**
     * Only match items that match the identification query
     */
    identifications?: IdentificationQuery,
    /**
     * Only match items that match the stat query
     */
    stats?: ItemStatQuery,
    /**
     * Only match items that match the major ID query
     */
    majorIds?: MajorIdQuery
}

/**
 * The options for a name search API request
 */
export interface NameSearchRequestOptions extends RequestOptions {
    /**
     * A string to search for
     */
    query: string
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
 * A Ratelimit channel has a private ratelimit that is unaffected by other
 * calls to the API
 * <div class="noteBox note" style="display:flex">
 *     <img src="../../assets/note.png", class="noteBoxIcon">Only calls using the <code>apiKey</code> of the channel affect the ratelimit.
 * </div>
 * <div class="noteBox note" style="display:flex">
 *     <img src="../../assets/note.png", class="noteBoxIcon">If no API keys are set in the config, only one channel exists with the <code>apiKey</code> being set to <code>null</code>.
 * </div>
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
     * The amount of milliseconds remaining until this channels' remaining
     * requests are reset to the limit
     */
    reset: number,
    /**
     * The amount of milliseconds after which this channels' remaining
     * requests are reset to the limit
     */
    interval: number,
    /**
     * The amount of requests currently queued
     * to be processed using this key
     */
    queued: number
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
     * Whether to allow requests to use the cache
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">This is overridden by {@link RequestOptions.allowCache}.
     * </div>
     * @default true
     */
    allowCacheByDefault: boolean,
    /**
     * Whether to allow request stacking in raw API calls
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">This is overridden by {@link RawRequestOptions.allowStacking}.
     * </div>
     * @default true
     */
    allowStackingByDefault: boolean,
    /**
     * Whether to reuse JSON objects returned by the fetchRaw() function
     * instead of regenerating them every time they are drawn from cache
     * <div class="noteBox important" style="display:flex">
     *     <img src="../../assets/important.png", class="noteBoxIcon">Disabling this hurts performance, but hardens the code against bugs due to downstream code modifying API responses in the cache.
     * </div>
     * @default true
     */
    reuseJson: boolean,
    /**
     * The API keys being used
     */
    apiKeys: ApiKey[],
    /**
     * The amount of times a request should be retried on error
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">This is overridden by {@link RequestOptions.retries}.
     * </div>
     * @default 3
     */
    defaultRetries: number,
    /**
     * The amount of milliseconds a until a request should be rejected
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">This is overridden by {@link RequestOptions.timeout}.
     * </div>
     * @default 30000
     */
    defaultTimeout: number,
    /**
     * Information on all supported routes
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
     * Whether to allow requests to use the cache
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">This is overridden by {@link RequestOptions.allowCache}.
     * </div>
     */
    allowCacheByDefault?: boolean,
    /**
     * Whether to allow request stacking in raw API calls
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">This is overridden by {@link RawRequestOptions.allowStacking}.
     * </div>
     */
    allowStackingByDefault?: boolean,
    /**
     * Whether to reuse JSON objects returned by the fetchRaw() method
     * instead of regenerating them every time they are drawn from cache;
     * <div class="noteBox important" style="display:flex">
     *     <img src="../../assets/important.png", class="noteBoxIcon">Disabling this hurts performance, but hardens the code against bugs due to downstream code modifying API responses in the cache.
     * </div>
     */
    reuseJson?: boolean,
    /**
     * The API keys to use
     */
    apiKeys?: ApiKey[],
    /**
     * The amount of times a request should be retried on error
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">This is overridden by {@link RequestOptions.retries}.
     * </div>
     */
    defaultRetries?: number,
    /**
     * The amount of milliseconds a until a request should be rejected
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">This is overridden by {@link RequestOptions.timeout}.
     * </div>
     */
    defaultTimeout?: number,
    /**
     * The amount of milliseconds to cache requests of these routes for
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">This is overridden by {@link RequestOptions.cacheFor}.
     * </div>
     */
    defaultCacheTimes?: CacheTimeOptions
}

/**
 * An API Key
 */
export interface ApiKey {
    /**
     * The key itself
     */
    key: string,
    /**
     * The maximum amount of requests this key allows for in each interval
     */
    limit: number,
    /**
     * The period length in milliseconds after which the key's requests are restored to the limit
     */
    interval: number
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
     * Name search route
     */
    NAME_SEARCH: Route,
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
 * A singular route to the API
 */
export interface Route {
    /**
     * The URL of the route
     */
    url: WynncraftAPIRoute,
    /**
     * The amount of milliseconds to cache data from this route for
     */
    cacheTime: number,
    /**
     * The API version of this route the wrapper was build for
     */
    version: SemanticVersion | number;
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
     * The cache time for the name search
     */
    NAME_SEARCH?: number,
    /**
     * The cache time for athenas item route
     */
    ATHENA_ITEMS?: number,
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
 * An ID filter to match when requesting items or ingredients
 * <div class="noteBox tip" style="display:flex">
 *     <img src="../../assets/tip.png", class="noteBoxIcon">Values for ID bounds have to be integer.
 * </div>
 * <div class="noteBox tip" style="display:flex">
 *     <img src="../../assets/tip.png", class="noteBoxIcon">Use an empty range <code>{}</code> to search for an ID with any value.
 * </div>
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
 * <div class="noteBox tip" style="display:flex">
 *     <img src="../../assets/tip.png", class="noteBoxIcon">Values for modifier bounds have to be integer.
 * </div>
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
 * <div class="noteBox tip" style="display:flex">
 *     <img src="../../assets/tip.png", class="noteBoxIcon">Values for range bounds have to be integer.
 * </div>
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
     * Only matches items with this quest requirement
     * @case-insensitive
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
 * <div class="noteBox tip" style="display:flex">
 *     <img src="../../assets/tip.png", class="noteBoxIcon">Values must be integer.
 * </div>
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
 * A filter for restricted IDs to match when searching for ingredients
 * <div class="noteBox tip" style="display:flex">
 *     <img src="../../assets/tip.png", class="noteBoxIcon">Values for ID bounds have to be integer.
 * </div>
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
 * Represents the basis of all objects returned by API requests
 */
export class BaseAPIObject {
    public constructor(requestTimestamp: number, timestamp: number, apiVersion: SemanticVersion, libVersion: SemanticVersion, source: WynncraftAPIRoute);

    /**
     * The unix timestamp indicating when this request started executing
     */
    public requestedAt: number;
    /**
     * The unix timestamp indicating when the data of this request was last
     * updated
     * <div class="noteBox warning" style="display:flex">
     *     <img src="../../assets/warning.png", class="noteBoxIcon">This stat does not reflect the time this data was created, but when the API frontend last synced this data. The PvP leaderboard, for instance, updates once per hour. Yet this timestamp will update once every 30 seconds.
     * </div>
     */
    public timestamp: number;
    /**
     * The version of the requested API route
     */
    public apiVersion: SemanticVersion;
    /**
     * The version of the representation of the data by the wrapper
     */
    public libVersion: SemanticVersion;
    /**
     * The route used to request the data for this object
     * <div class="noteBox tip" style="display:flex">
     *     <img src="../../assets/tip.png", class="noteBoxIcon">This is the value used to identify cache entries. API results with the same source can use the cache.
     * </div>
     */
    public source: WynncraftAPIRoute;
}

/**
 * Represents the result of a name search on the Wynncraft API
 */
export class NameSearch extends BaseAPIObject {
    private constructor(v: Object);

    /**
     * The guild names including the search pattern in their name
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">Ordered in ascending order of creation date.
     * </div>
     */
    public guilds: string[];
    /**
     * The player names matching the search query
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">Ordered in descending order of first join date.
     * </div>
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">It is not clear how exactly the search matches players, but most names require a near exact match.
     * </div>
     */
    public players: string[];
}

/**
 * Represents an important location on the Wynncraft map
 */
export class MapLocation {
    private constructor(v: Object);

    /**
     * The name of the location
     */
    public name: MapLocationName;
    /**
     * The icon the Wynncraft map uses to display this location
     */
    public icon: MapLocationIcon;
    /**
     * The X coordinate of the location
     */
    public x: number;
    /**
     * The Y coordinate of the location
     */
    public y: number;
    /**
     * The Z coordinate of the location
     */
    public z: number;
}

/**
 * Represents the party information for a specific player
 */
export class PlayerParty extends BaseAPIObject {
    private constructor(data: any);

    /**
     * The world the player is currently logged into
     */
    public world: string;
    /**
     * The player to whom this request is bound
     */
    public self: PlayerPartyMember;
    /**
     * The members of the player's party. This includes all guild members and friends currently logged into the same world, along with all party members of the player, regardless of whether they share a world.
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">The connected player themselves is not included in this list.
     * </div>
     */
    public party: PlayerPartyMember[];
}

export class PlayerPartyMember {
    private constructor(v: any);

    /**
     * The name of the player
     */
    public name: string;
    /**
     * The UUID of the player
     */
    public uuid: string;
    /**
     * The X coordinate of the player
     */
    public x: number;
    /**
     * The Y coordinate of the player
     */
    public y: number;
    /**
     * The Z coordinate of the player
     */
    public z: number;
    /**
     * The maximum health of the player
     */
    public maxHealth: number;
    /**
     * The current health of the player
     */
    public health: number;

    /**
     * Fetches the player stats of the party member
     * <div class="noteBox important" style="display:flex">
     *     <img src="../../assets/important.png", class="noteBoxIcon">This method causes API requests.
     * </div>
     * @param options The options for the request; the `player` field has no effect
     */
    public fetch(options?: PlayerRequestOptions): Promise<Player>;
}

/**
 * Represents an Item from the API
 */
export class Item {
    private constructor(v: Object);

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
     * The set the item is part of, if any
     * <div class="noteBox warning" style="display:flex">
     *     <img src="../../assets/warning.png", class="noteBoxIcon">Currently, only the LEAF set uses this field.
     * </div>
     */
    public set: string?;
    /**
     * the visual sprite of the item
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon"><div>Items using mob heads (not player heads) will display as <code>minecraft:leather_helmet</code> and no ItemSkin.</div>
     * </div>
     */
    public sprite: Sprite;
    /**
     * The armor color of the item
     */
    public color: number[]?;
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
    public restriction: ItemRestriction?;
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
    public skin: ItemSkin?;
    /**
     * Whether the item is pre-identified (i.e. items bought from merchants)
     */
    public identified: boolean;
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
     * The combined level of the class
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">Contrary to the API, this includes level 1 of professions.
     * </div>
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
     * A list of all dungeons completed on this class
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">Ordered in ascending order of first completion.
     * </div>
     */
    public dungeons: RepeatableContent[];
    /**
     * A list of all raids completed on this class
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">Ordered in ascending order of first completion.
     * </div>
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
     * The nether PvP stats of the class
     */
    public pvp: PvpData;
    /**
     * The playtime on this class
     */
    public playtime: number;
    /**
     * The amount of items identified on this class
     * <div class="noteBox warning" style="display:flex">
     *     <img src="../../assets/warning.png", class="noteBoxIcon">This statistic is no longer being updated.
     * </div>
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
     * The amount of blocks travelled by this class
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">This also counts teleportation by quests etc.
     * </div>
     * <div class="noteBox warning" style="display:flex">
     *     <img src="../../assets/warning.png", class="noteBoxIcon">The field overflows like a 32-bit integer.
     * </div>
     */
    public blocksWalked: number;
    /**
     * The total amount of discoveries on this class
     * <div class="noteBox warning" style="display:flex">
     *     <img src="../../assets/warning.png", class="noteBoxIcon">This includes duplicate or removed discoveries.
     * </div>
     */
    public discoveries: number;
    /**
     * The amount of swarms won on this class
     */
    public eventsWon: number;
    /**
     * Whether this class has reached combat level 101 before the Economy
     * Update 1.18 released
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">Classes with this flag display a star next to their level in chat.
     * </div>
     */
    public hasEconomyStar: boolean;
}

/**
 * Represents a player from the API
 */
export class Player extends BaseAPIObject {
    private constructor(data: Object, params: Object);

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
     * The first join of the player as a Date
     */
    public firstJoin: Date;
    /**
     * The first join of the player as a unix timestamp
     */
    public firstJoinTimestamp: number;
    /**
     * The last join of the player as a Date
     */
    public lastJoin: Date;
    /**
     * The last join of the player as a unix timestamp
     */
    public lastJoinTimestamp: number;
    /**
     * The playtime of the player
     * <div class="noteBox tip" style="display:flex">
     *     <img src="../../assets/tip.png", class="noteBoxIcon">The playtime doesn't have a specific unit. This value is roughly equal to one fifth of the player's playtime, however.
     * </div>
     */
    public playtime: number;
    /**
     * The current world of the player; `null` if offline
     */
    public world: string?;
    /**
     * The guild data of the player
     */
    public guild: PlayerGuildData;
    /**
     * The total levels of the player
     */
    public totalLevel: PlayerLevelsData;
    /**
     * The nether PvP stats of the player
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
     * The total amount of blocks travelled by the player
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">This also counts teleportation by quests etc.
     * </div>
     * <div class="noteBox warning" style="display:flex">
     *     <img src="../../assets/warning.png", class="noteBoxIcon">The field overflows like a 32-bit integer.
     * </div>
     */
    public blocksWalked: number;
    /**
     * The total amount of items identified
     * <div class="noteBox warning" style="display:flex">
     *     <img src="../../assets/warning.png", class="noteBoxIcon">This statistic is no longer being updated.
     * </div>
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
     * The total amount of discoveries
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">This includes duplicate and removed discoveries.
     * </div>
     */
    public discoveries: number;
    /**
     * The total amount of swarms won
     */
    public eventsWon: number;
    /**
     * The leaderboard rankings of the player in all levels; `null` if not in #100
     * <div class="noteBox warning" style="display:flex">
     *     <img src="../../assets/warning.png", class="noteBoxIcon"><div>If the player name was misspelled in the {@link PlayerRequestOptions.player | options}, the rankings are always <code>null</code></div>.
     * </div>
     */
    public ranking: PlayerRankings;
}

/**
 * Represents a member of a guild
 */
export class GuildMember {
    private constructor(v: Object);

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
     * The current world the player is online on, if any
     * <div class="noteBox important" style="display:flex">
     *     <img src="../../assets/important.png", class="noteBoxIcon"><div>Only set if {@link Guild.hasAdditionalStats} is true</div>.
     * </div>
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">If two members of a guild are online on the same world, this value refers to the same object.
     * </div>
     */
    public world?: World;

    /**
     * Fetches the player stats of the guild member
     * <div class="noteBox important" style="display:flex">
     *     <img src="../../assets/important.png", class="noteBoxIcon">This method causes API requests.
     * </div>
     * @param options The options for the request; the `player` field has no effect
     */
    public fetch(options?: PlayerRequestOptions): Promise<Player>;
}

/**
 * Represents a guild from the API
 */
export class Guild extends BaseAPIObject {
    private constructor(data: Object, params: Object);

    /**
     * The name of the guild
     */
    public name: string;
    /**
     * The tag of the guild
     */
    public tag: string;
    /**
     * Indicates whether the object has the data returned if
     * `GuildRequestOptions.fetchAdditionalStats=true` during request
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">This is used to determine whether `Guild#fetchAdditionalStats()` has an effect.
     * </div>
     */
    public hasAdditionalStats: boolean;
    /**
     * The level of the guild
     */
    public level: number;
    /**
     * The level progress of the guilds current level
     * as a number between 0 and 1
     */
    public xp: number;
    /**
     * Some data that was extracted from the guild level
     * <div class="noteBox important" style="display:flex">
     *     <img src="../../assets/important.png", class="noteBoxIcon"><div>Make sure <code>Guild#xpFriendly.isSafe</code> is <code>true</code>, the data will only be present on guild levels up to 150.</div>
     * </div>
     */
    public xpFriendly: GuildXPInterpretation;
    /**
     * The creation date of the guild
     */
    public created: Date;
    /**
     * The creation date of the guild as a unix timestamp
     */
    public createdTimestamp: number;
    /**
     * The amount of territories the guild currently holds
     * <div class="noteBox important" style="display:flex">
     *     <img src="../../assets/important.png", class="noteBoxIcon"><div>If <code>hasAdditionalStats=true</code>, this is an array of {@link Territory | Territories} instead.</div>
     * </div>
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
     * Mutates the object as if the fetchAdditionalStats property was `true`
     * when this guild was requested
     * <div class="noteBox important" style="display:flex">
     *     <img src="../../assets/important.png", class="noteBoxIcon">This method causes API requests.
     * </div>
     * @param options The options for the request; the `guild` field has no effect
     */
    public fetchAdditionalStats(options?: GuildRequestOptions): Promise<Guild>;
}

/**
 * Represents an ingredient from the API
 */
export class Ingredient {
    private constructor(v: Object);

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
 * A recipe from the API
 */
export class Recipe {
    private constructor(v: Object);

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
 * Represents a Territory from the API
 */
export class Territory {
    private constructor(v: Object);

    /**
     * The name of the territory
     */
    public territory: string;
    /**
     * The name of the guild holding the territory; `null` if no guild owns the territory
     * @readonly
     */
    public guild: string?;
    /**
     * The attacker of the territory
     * <div class="noteBox warning" style="display:flex">
     *     <img src="../../assets/warning.png", class="noteBoxIcon">This field is currently unused.
     * </div>
     */
    public attacker: string?;
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
     * The amount of resources produced by the territory at base production
     */
    public resources: Resources;
    /**
     * The territories connected to the territory
     */
    public connections: Territory[];

    /**
     * Fetches the guild stats of the owner guild
     * <div class="noteBox important" style="display:flex">
     *     <img src="../../assets/important.png", class="noteBoxIcon">This method causes API requests.
     * </div>
     * @param options The options for the request; the `guild` field has no effect
     */
    public fetchOwner(options?: GuildRequestOptions): Promise<Guild>;
}

/**
 * Represents a player in a leaderboard from the API
 */
export class LeaderboardPlayer {
    private constructor(v: Object);

    /**
     * The account name of the player
     */
    public name: string;
    /**
     * The UUID of the player
     * @readonly
     */
    public uuid: string;
    /**
     * The rank information of the player
     * <div class="noteBox warning" style="display:flex">
     *     <img src="../../assets/warning.png", class="noteBoxIcon">The <code>displayTag</code> and <code>veteran</code> properties are currently always false, unless both are true.
     * </div>
     */
    public rank: RankData;
    /**
     * The playtime of the player
     */
    public playtime: number;
    /**
     * The {@link ClassType} that earns the player their spot on the
     * leaderboard
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon"><div>Only set if the requested {@link PlayerLeaderboardScope | scope} was <code>SOLO</code></div>.
     * </div>
     */
    public class?: ClassType;
    /**
     * The respective level of the player
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">Only set if the type of the request wasn't <code>PVP</code>.
     * </div>
     */
    public level?: number;
    /**
     * The additional XP the player has gathered beyond their current
     * level
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">Only set if the type of the request wasn't <code>PVP</code>.
     * </div>
     */
    public xp?: number;
    /**
     * The nether kills of the player
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon"><div>Only set if the {@link PlayerTotalLeaderboardType | type} of the request was <code>PVP</code></div>.
     * </div>
     */
    public kills?: number;

    /**
     * Fetches the player stats of the player
     * <div class="noteBox important" style="display:flex">
     *     <img src="../../assets/important.png", class="noteBoxIcon">This method causes API requests.
     * </div>
     * @param options The options of the request; the `player` field has no effect
     */
    public fetchPlayer(options?: PlayerRequestOptions): Promise<Player>;
}

/**
 * Represents a guild in a leaderboard from the API
 */
export class LeaderboardGuild {
    private constructor(v: Object);

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
     * The war count of the guild
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">Counts all war attempts.
     * </div>
     */
    public warCount: number;

    /**
     * Fetches the stats of the guild
     * <div class="noteBox important" style="display:flex">
     *     <img src="../../assets/important.png", class="noteBoxIcon">This method causes API requests.
     * </div>
     * @param options The options for the request; the `guild` field has no effect
     */
    public fetch(options?: GuildRequestOptions): Promise<Guild>;
}

/**
 * Represents a world or server on Wynncraft
 */
export class World {
    private constructor(v: Object);

    /**
     * The identifier of the world
     */
    public name: string;
    /**
     * The type of world
     */
    public worldType: WorldType;
    /**
     * An array of player names who are online on the world
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">Sorted in ascending order of login time.
     * </div>
     */
    public players: string[];
}

/**
 * Represents a list of API objects
 */
export class List<T> extends BaseAPIObject {
    private constructor(arr: T[], params: Object);

    /**
     * The entries in the list
     */
    public list: T[];
}

/**
 * Represents the sum of online players on Wynncraft
 */
export class OnlinePlayersSum extends BaseAPIObject {
    private constructor(data: Object, params: Object);

    /**
     * The amount of players currently online on Wynncraft
     */
    public players: number;
}










/**
 * A <a href="https://semver.org/" target="_blank">semantic version identifier</a>
 */
export type SemanticVersion = `${number}.${number}.${number}`;

/**
 * A value resolvable to a minecraft item id
 */
export type MinecraftId = MinecraftStringId | number;

/**
 * A value resolvable to a minecraft item id in string form
 */
export type MinecraftStringId = `minecraft:${string}`;

/**
 * A range containing numbers between certain threshholds,
 * or above/below a threshhold if only one is given
 * <div class="noteBox note" style="display:flex">
 *     <img src="../../assets/note.png", class="noteBoxIcon">Some input fields for OpenRanges may require integers.
 * </div>
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
 * A range containing numbers between certain threshholds
 * <div class="noteBox note" style="display:flex">
 *     <img src="../../assets/note.png", class="noteBoxIcon">Some input fields for OpenRanges may require integers.
 * </div>
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
     * Whether the class is in the Hunted gamemode
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">The <code>hunted</code> field does not reflect whether the player has the hunted mode turned on.
     * </div>
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
    | "MEDIA"
    | "PLAYER";

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
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">The Wynncraft criteria for a veteran is whether the player has bought a rank before the 2014 Minecraft EULA change.
     * </div>
     */
    veteran: boolean
}

/**
* Holds information about a players Guild
*/
export interface PlayerGuildData {
    /**
     * The name of the player's Guild, if applicable
     * @readonly
     */
    name: string?,
    /**
     * The player's rank in the Guild, if applicable
     */
    rank: GuildRank?,
    /**
     * Returns the API object of the Guild, if applicable
     * <div class="noteBox important" style="display:flex">
     *     <img src="../../assets/important.png", class="noteBoxIcon">This method causes API requests.
     * </div>
     * @param options The options for the request; the field `guild` has no effect
     */
    fetch(options?: GuildRequestOptions): Promise<Guild>
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
 * Holds information on the player's leaderboard rankings
 */
export interface PlayerRankings {
    /**
     * The ranking of the player's Guild
     * <div class="noteBox warning" style="display:flex">
     *     <img src="../../assets/warning.png", class="noteBoxIcon">This field is currently unused.
     * </div>
     */
    guild: number?,
    /**
     * The PvP ranking of the player
     * <div class="noteBox warning" style="display:flex">
     *     <img src="../../assets/warning.png", class="noteBoxIcon">This field is currently unused.
     * </div>
     */
    pvp: number?,
    /**
     * The level rankings of the player
     */
    player: PlayerLevelRankings
}

/**
 * A player's level rankings
 */
export interface PlayerLevelRankings {
    /**
     * The level rankings for combined levels across all classes
     */
    combined: PlayerTotalLevelRankings,
    /**
     * The level rankings for single class levels
     */
    solo: PlayerSoloLevelRankings
}

/**
 * A player's combined level rankings
 */
export interface PlayerTotalLevelRankings {
    /**
     * Position in the `TOTAL`/`COMBINED` leaderboard
     */
    all: number?,
    /**
     * Position in the `TOTAL`/`COMBAT` leaderboard
     */
    combat: number?,
    /**
     * Position in the `TOTAL`/`PROFESSION` leaderboard
     */
    profession: number?
}

/**
 * A player's single class level rankings
 */
export interface PlayerSoloLevelRankings {
    /**
     * Position in the `SOLO`/`COMBINED` leaderboard
     */
    all: number?,
    /**
     * Position in the `SOLO`/`COMBAT` leaderboard
     */
    combat: number?,
    /**
     * Position in the `SOLO`/`PROFESSION` leaderboard
     */
    profession: number?,
    /**
     * Position in the `SOLO`/`MINING` leaderboard
     */
    mining: number?,
    /**
     * Position in the `SOLO`/`FARMING` leaderboard
     */
    farming: number?,
    /**
     * Position in the `SOLO`/`FISHING` leaderboard
     */
    fishing: number?,
    /**
     * Position in the `SOLO`/`WOODCUTTING` leaderboard
     */
    woodcutting: number?,
    /**
     * Position in the `SOLO`/`ARMORING` leaderboard
     */
    armoring: number?,
    /**
     * Position in the `SOLO`/`TAILORING` leaderboard
     */
    tailoring: number?,
    /**
     * Position in the `SOLO`/`JEWELING` leaderboard
     */
    jeweling: number?,
    /**
     * Position in the `SOLO`/`WOODWORKING` leaderboard
     */
    woodworking: number?,
    /**
     * Position in the `SOLO`/`WEAPONSMITHING` leaderboard
     */
    weaponsmithing: number?,
    /**
     * Position in the `SOLO`/`ALCHEMISM` leaderboard
     */
    alchemism: number?,
    /**
     * Position in the `SOLO`/`COOKING` leaderboard
     */
    cooking: number?,
    /**
     * Position in the `SOLO`/`SCRIBING` leaderboard
     */
    scribing: number?
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
    | "BROWN";

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
     * The layer's pattern
     */
    pattern: BannerPattern,
    /**
     * The layer's color
     */
    color: MinecraftColor
}

/**
* An object with data about a guild banner
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
 * A guild level in friendly format
 */
export interface GuildXPInterpretation {
    /**
     * If this is `false`, all other properties are `null`, should never be `false`, unless the library hasn't updated in years
     */
    isSafe: boolean,
    /**
     * The maximum error the xp values may be off by, divide `xpRaw` by this number in order to get the the lower bound for the xp value
     * @deprecated will be removed in the next major release
     */
    maxErrorLower: number,
    /**
     * The maximum error the xp values may be off by, multiply `xpRaw` by this number in order to get the upper bound for the xp value
     * @deprecated will be removed in the next major release
     */
    maxErrorUpper: number,
    /**
     * The progression of the guild towards the next guild level as a number between 0 and 1
     */
    xpPct: number,
    /**
     * The approximate raw amount of XP of the guild at this moment, this rounds down to the value of the nearest percent
     */
    xpRaw: number,
    /**
     * The total raw amount of XP required for this level
     */
    required: number
}

/**
 * A name for a map location
 */
export type MapLocationName =
    | "Decrepit Sewers Dungeon"
    | "Infested Pit Dungeon"
    | "Lost Sanctuary Dungeon"
    | "Underworld Crypt Dungeon"
    | "Sand-Swept Tomb Dungeon"
    | "Ice Barrows Dungeon"
    | "Undergrowth Ruins Dungeon"
    | "Galleon's Graveyard Dungeon"
    | "Fallen Factory Dungeon"
    | "Eldritch Outlook Dungeon"
    | "Corrupted Decrepit Sewers Dungeon"
    | "Corrupted Infested Pit Dungeon"
    | "Corrupted Lost Sanctuary Dungeon"
    | "Corrupted Underworld Crypt Dungeon"
    | "Corrupted Sand-Swept Tomb Dungeon"
    | "Corrupted Ice Barrows Dungeon"
    | "Corrupted Undergrowth Ruins Dungeon"

    | "A Grave Mistake"
    | "A Marauder's Dues"
    | "A Sandy Scandal"
    | "Acquiring Credentials"
    | "Aldorei's Secret Part I"
    | "Aldorei's Secret Part II"
    | "An Iron Heart Part I"
    | "An Iron Heart Part II"
    | "Arachnids' Ascent"
    | "Beyond the Grave"
    | "Blazing Retribution"
    | "Canyon Condor"
    | "Clearing the Camps"
    | "Corrupted Betrayal"
    | "Cowfusion"
    | "Craftmas Chaos"
    | "Creeper Infiltration"
    | "Death Whistle"
    | "Deja Vu"
    | "Desperate Metal"
    | "Dwarves and Doguns Part I"
    | "Dwarves and Doguns Part II"
    | "Dwarves and Doguns Part III"
    | "Dwarves and Doguns Part IV"
    | "Dwelling Walls"
    | "Elemental Exercise"
    | "Enter the Dojo"
    | "Fallen Delivery"
    | "Fantastic Voyage"
    | "Fate of the Fallen"
    | "Flight in Distress"
    | "From the Bottom"
    | "From the Mountains"
    | "General's Orders"
    | "Grand Youth"
    | "Green Gloop"
    | "Macabre Masquerade ''Hallowynn 2014''"
    | "Haven Antiquity"
    | "Realm of Light III - A Headless History"
    | "Heart of Llevigar"
    | "Infested Plants"
    | "King's Recruit"
    | "Lava Springs"
    | "Lazarus Pit"
    | "Lost in the Jungle"
    | "Lost Royalty"
    | "Lost Soles"
    | "The Maiden Tower"
    | "Master Piece"
    | "Meaningful Holiday"
    | "Memory Paranoia"
    | "Mixed Feelings"
    | "Murder Mystery"
    | "Mushroom Man"
    | "One Thousand Meters Under"
    | "Out of my Mind"
    | "Pirate's Trove"
    | "Pit of the Dead"
    | "Poisoning the Pest"
    | "Potion Making"
    | "Purple and Blue"
    | "Recipe For Disaster"
    | "Reclaiming the House"
    | "Recover the Past"
    | "Redbeard's Booty"
    | "Rise of the Quartron"
    | "Royal Trials"
    | "???"
    | "The Sewers of Ragni"
    | "Shattered Minds"
    | "Tempo Town Trouble"
    | "The Belly of the Beast"
    | "The Bigger Picture"
    | "The Canary Calls"
    | "The Canyon Guides"
    | "The Corrupted Village"
    | "The Dark Descent"
    | "The Envoy Part I"
    | "The Envoy Part II"
    | "The Fortuneteller"
    | "The Hero of Gavel"
    | "The Hidden City"
    | "The Hunger of Gerts Part 1"
    | "The Hunger of Gerts Part 2"
    | "The Lost"
    | "The Mercenary"
    | "The Order of the Grook"
    | "The Qira Hive"
    | "The Shadow of the Beast"
    | "The Thanos Vaults"
    | "The Ultimate Weapon"
    | "Tower of Ascension"
    | "Tribal Aggression"
    | "Troubled Tribesmen"
    | "Tunnel Trouble"
    | "UndericeÀ"
    | "WynnExcavation Site A"
    | "WynnExcavation Site B"
    | "WynnExcavation Site C"
    | "WynnExcavation Site D"
    | "Zhight Island"
    | "A Journey Beyond"
    | "A Journey Further"
    | "A Hunter's Calling"
    | "Frost Bite"
    | "Kingdom of Sand"
    | "Misadventure on the Sea"
    | "Point of No Return"
    | "Star Thief"
    | "Studying the Corrupt"
    | "The Olmic Rune"
    | "Crop Failure"
    | "Realm of Light IV - Finding the Light"
    | "Forbidden Prison"
    | "Lexdale Witch Trials"
    | "Realm of Light V - The Realm of Light"
    | "The Feathers Fly Part I"
    | "The Feathers Fly Part II"
    | "Realm of Light I - The Worm Holes"
    | "Realm of Light II - Taproot"

    | "Mini-Quest - Slay Mooshrooms"
    | "Mini-Quest - Gather Barley"
    | "Mini-Quest - Gather Birch Logs"
    | "Mini-Quest - Gather Granite"
    | "Mini-Quest - Gather Trout"
    | "Mini-Quest - Gather Gold"
    | "Mini-Quest - Gather Oats"
    | "Mini-Quest - Gather Salmon"
    | "Mini-Quest - Gather Willow Logs"
    | "Mini-Quest - Slay Skeletons"
    | "Mini-Quest - Gather Gold II"
    | "Mini-Quest - Gather Oats II"
    | "Mini-Quest - Gather Salmon II"
    | "Mini-Quest - Gather Willow Logs II"
    | "Mini-Quest - Slay Scarabs"
    | "Mini-Quest - Gather Acacia Logs"
    | "Mini-Quest - Gather Carp"
    | "Mini-Quest - Gather Malt"
    | "Mini-Quest - Gather Sandstone"
    | "Mini-Quest - Slay Coyotes"
    | "Mini-Quest - Gather Acacia Logs II"
    | "Mini-Quest - Gather Carp II"
    | "Mini-Quest - Gather Malt II"
    | "Mini-Quest - Gather Sandstone II"
    | "Mini-Quest - Slay Creatures of Nesaak Forest"
    | "Mini-Quest - Gather Hops"
    | "Mini-Quest - Gather Icefish"
    | "Mini-Quest - Gather Iron"
    | "Mini-Quest - Gather Spruce Logs"
    | "Mini-Quest - Slay Orcs"
    | "Mini-Quest - Gather Hops II"
    | "Mini-Quest - Gather Icefish II"
    | "Mini-Quest - Gather Iron II"
    | "Mini-Quest - Gather Spruce Logs II"
    | "Mini-Quest - Slay Slimes"
    | "Mini-Quest - Gather Jungle Logs"
    | "Mini-Quest - Gather Piranhas"
    | "Mini-Quest - Gather Rye"
    | "Mini-Quest - Gather Silver"
    | "Mini-Quest - Slay Lizardmen"
    | "Mini-Quest - Gather Jungle Logs II"
    | "Mini-Quest - Gather Piranhas II"
    | "Mini-Quest - Gather Rye II"
    | "Mini-Quest - Gather Silver II"
    | "Mini-Quest - Slay Spiders"
    | "Mini-Quest - Slay Wraiths & Phantasms"
    | "Mini-Quest - Gather Cobalt"
    | "Mini-Quest - Gather Dark Logs"
    | "Mini-Quest - Gather Koi"
    | "Mini-Quest - Gather Millet"
    | "Mini-Quest - Gather Cobalt II"
    | "Mini-Quest - Gather Dark Logs II"
    | "Mini-Quest - Gather Koi II"
    | "Mini-Quest - Gather Millet II"
    | "Mini-Quest - Slay Idols"
    | "Mini-Quest - Gather Cobalt III"
    | "Mini-Quest - Gather Dark Logs III"
    | "Mini-Quest - Gather Koi III"
    | "Mini-Quest - Gather Millet III"
    | "Mini-Quest - Slay Dead Villagers"
    | "Mini-Quest - Gather Decay Roots"
    | "Mini-Quest - Gather Gylia Fish"
    | "Mini-Quest - Gather Kanderstone"
    | "Mini-Quest - Gather Light Logs"
    | "Mini-Quest - Gather Decay Roots II"
    | "Mini-Quest - Gather Gylia Fish II"
    | "Mini-Quest - Gather Kanderstone II"
    | "Mini-Quest - Gather Light Logs II"
    | "Mini-Quest - Slay Myconids"
    | "Mini-Quest - Slay Weirds"
    | "Mini-Quest - Gather Decay Roots III"
    | "Mini-Quest - Gather Gylia Fish III"
    | "Mini-Quest - Gather Kanderstone III"
    | "Mini-Quest - Gather Light Logs III"
    | "Mini-Quest - Slay Felrocs"
    | "Mini-Quest - Slay Hobgoblins"
    | "Mini-Quest - Gather Bass"
    | "Mini-Quest - Gather Diamonds"
    | "Mini-Quest - Gather Pine Logs"
    | "Mini-Quest - Gather Rice"
    | "Mini-Quest - Gather Bass II"
    | "Mini-Quest - Gather Diamonds II"
    | "Mini-Quest - Gather Pine Logs II"
    | "Mini-Quest - Gather Rice II"
    | "Mini-Quest - Slay Jinkos"
    | "Mini-Quest - Slay Robots"
    | "Mini-Quest - Gather Bass III"
    | "Mini-Quest - Gather Diamonds III"
    | "Mini-Quest - Gather Pine Logs III"
    | "Mini-Quest - Gather Rice III"
    | "Mini-Quest - Gather Bamboo"
    | "Mini-Quest - Gather Bass IV"
    | "Mini-Quest - Gather Diamonds IV"
    | "Mini-Quest - Gather Rice IV"
    | "Mini-Quest - Slay Ailuropodas"
    | "Mini-Quest - Gather Copper"
    | "Mini-Quest - Gather Gudgeon"
    | "Mini-Quest - Gather Oak Logs"
    | "Mini-Quest - Gather Wheat"
    | "Mini-Quest - Slay Pernix Monkeys"
    | "Mini-Quest - Gather Avo Logs"
    | "Mini-Quest - Gather Molten Eel"
    | "Mini-Quest - Gather Molten Ore"
    | "Mini-Quest - Gather Sorghum"
    | "Mini-Quest - Slay Magma Entities"
    | "Mini-Quest - Slay Frosted Guards & Cryostone Golems"
    | "Mini-Quest - Gather Avo Logs II"
    | "Mini-Quest - Gather Molten Eel II"
    | "Mini-Quest - Gather Molten Ore II"
    | "Mini-Quest - Gather Sorghum II"
    | "Mini-Quest - Slay Ifrits"
    | "Mini-Quest - Slay Astrochelys Manis"
    | "Mini-Quest - Gather Avo Logs III"
    | "Mini-Quest - Gather Molten Eel III"
    | "Mini-Quest - Gather Molten Ore III"
    | "Mini-Quest - Gather Sorghum III"
    | "Mini-Quest - Slay Creatures of the Void"
    | "Mini-Quest - Slay Conures"
    | "Mini-Quest - Gather Avo Logs IV"
    | "Mini-Quest - Gather Molten Eel IV"
    | "Mini-Quest - Gather Molten Ore IV"
    | "Mini-Quest - Gather Sorghum IV"
    | "Mini-Quest - Slay Angels"
    | "Mini-Quest - Slay Dragonlings"

    | "Nether Portal"
    | "Fast Travel"
    | "Light's Secret"
    | "Uth Shrine"
    | "Ultimate Discovery"
    | "Corrupted Dungeons"
    | "Guild Master"
    | "Grind Spot"
    | "Cave"
    | "Tol Altar"
    | "Boss Altar"
    | "Orphion's Nexus of Light"
    | "The Canyon Colossus"
    | "Nest of the Grootslangs"

    | "Trade Market"
    | "Blacksmith"
    | "Identifier"
    | "Powder Master"

    | "Key Forge Merchant"
    | "Dungeon Scroll Merchant"
    | "Emerald Merchant"
    | "Armour Merchant"
    | "Weapon Merchant"
    | "Junk Merchant"
    | "Boat Merchant"
    | "Treasure Merchant"
    | "Wynnter 2016 Merchant"
    | "Fish Merchant"
    | "Scroll Merchant"
    | "Bucket Merchant"
    | "Egg Merchant"
    | "Emeralds Merchant"
    | "Potion Merchant"
    | "Pink Wool Merchant"
    | "Feather Merchant"
    | "Mushroom Merchant"
    | "Water Merchant"
    | "Potato Merchant"
    | "Apple Merchant"
    | "Book Merchant"
    | "Necromancy Merchant"
    | "Quartz Merchant"
    | "Melon Merchant"
    | "Cobblestone Merchant"
    | "Shifty Merchant"
    | "Gold Dealer Merchant"
    | "Artefact Merchant"
    | "Art Merchant"
    | "King's Merchant"
    | "Liquid Merchant"
    | "Clock Merchant"
    | "Dungeon Merchant"
    | "Suri Merchant"
    | "Stiba Merchant"
    | "Accessory Merchant"
    | "Rymek Dealer Merchant"
    | "Gert Merchant"
    | "Tribal Merchant"
    | "Explosives Merchant"
    | "Black Market Merchant"
    | "Seaskipper Merchant"
    | "Seasail Merchant"
    | "Fabrics Merchant"
    | "Squid Merchant"
    | "Siegfried Fan Item Merchant"
    | "Hook Merchant"
    | "Collector Merchant"
    | "Recipe Merchant"
    | "Wig Merchant"
    | "Tribal Armour Merchant"
    | "Tribal Weapon Merchant"
    | "Charmcrafter Merchant"
    | "Mask Merchant"
    | "Diamond Rewards Merchant"
    | "Exchange Merchant"
    | "Powder Merchant"
    | "Craftmas Merchant"
    | "Bronze Rewards Merchant"
    | "Silver Rewards Merchant"
    | "Gold Rewards Merchant"
    | "Golden Fish Merchant"
    | "Glassblowing Merchant"
    | "Wynnter 2017 Merchant"
    | "Souvenir Merchant"
    | "Horse Merchant"
    | "Ticket Merchant"
    | "Tool Merchant"
    | "Bowl Merchant"
    | "Hive Thunder Merchant"
    | "Transmutation Merchant"
    | "Hive Air Merchant"
    | "Hive Earth Merchant"
    | "Hive Water Merchant"
    | "Hive Fire Merchant"
    | "Master Trinket Merchant"
    | "Master Armour Merchant"
    | "Master Weapon Merchant"
    | "Zhight Exchange Merchant"
    | "Zhight Brew Merchant"
    | "Brew-it-Yourself Merchant"
    | "Treasure Prize Merchant"
    | "Gift Merchant"
    | "Literature Merchant"
    | "Ingredient Merchant"
    | "Tour Pass Merchant"
    | "Reset Scroll Merchant"
    | "Miner Pass Merchant"
    | "Mysterious Merchant"

    | "Weaponsmithing Station"
    | "Armouring Station"
    | "Alchemism Station"
    | "Jeweling Station"
    | "Tailoring Station"
    | "Scribing Station"
    | "Cooking Station"
    | "Woodworking Station"
    | "Tailor Station";

/**
 * An icon for a map location
 */
export type MapLocationIcon =
    | "Content_Dungeon.png"
    | "Content_CorruptedDungeon.png"
    | "Content_Quest.png"
    | "Content_Miniquest.png"
    | "Content_UltimateDiscovery.png"
    | "Content_GrindSpot.png"
    | "Content_Cave.png"
    | "Content_BossAltar.png"
    | "Content_Raid.png"

    | "NPC_GuildMaster.png"
    | "NPC_TradeMarket.png"
    | "NPC_Blacksmith.png"
    | "NPC_ItemIdentifier.png"
    | "NPC_PowderMaster.png"

    | "Merchant_KeyForge.png"
    | "Merchant_Scroll.png"
    | "Merchant_Emerald.png"
    | "Merchant_Armour.png"
    | "Merchant_Weapon.png"
    | "Merchant_Other.png"
    | "Merchant_Potion.png"
    | "Merchant_Liquid.png"
    | "Merchant_Dungeon.png"
    | "Merchant_Accessory.png"
    | "Merchant_Seasail.png"
    | "Merchant_Horse.png"
    | "Merchant_Tool.png"
    | "painting.png"
    | "tnt.png"

    | "Profession_Weaponsmithing.png"
    | "Profession_Armouring.png"
    | "Profession_Alchemism.png"
    | "Profession_Jeweling.png"
    | "Profession_Tailoring.png"
    | "Profession_Scribing.png"
    | "Profession_Cooking.png"
    | "Profession_Woodworking.png"

    | "Special_RootsOfCorruption.png"
    | "Special_FastTravel.png"
    | "Special_LightRealm.png"
    | "Special_Rune.png";

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
    health: number?,
    /**
     * The earth defence of the armor piece or accessory
     */
    earthDefence: number?,
    /**
     * The thunder defence of the armor piece or accessory
     */
    thunderDefence: number?,
    /**
     * The water defence of the armor piece or accessory
     */
    waterDefence: number?,
    /**
     * The fire defence of the armor piece or accessory
     */
    fireDefence: number?,
    /**
     * The air defence of the armor piece or accessory
     */
    airDefence: number?,
    /**
     * The neutral damage of the weapon
     */
    damage: Range?,
    /**
     * The earth damage of the weapon
     */
    earthDamage: Range?,
    /**
     * The thunder damage of the weapon
     */
    thunderDamage: Range?,
    /**
     * The water damage of the weapon
     */
    waterDamage: Range?,
    /**
     * The fire damage of the weapon
     */
    fireDamage: Range?,
    /**
     * The air damage of the weapon
     */
    airDamage: Range?,
    /**
     * The attack speed of the weapon
     */
    attackSpeed: AttackSpeed?
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
    quest: string?,
    /**
     * The class required to use the item
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">The value here is always the non-donator class.
     * </div>
     * <div class="noteBox warning" style="display:flex">
     *     <img src="../../assets/warning.png", class="noteBoxIcon">This field is currently never set on weapons.
     * </div>
     */
    class: ClassType?,
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
 * An item skin as found in the mojang API
 */
export interface ItemSkin {
    /**
     * The UUID of the player used for the skin
     * <div class="noteBox warning" style="display:flex">
     *     <img src="../../assets/warning.png", class="noteBoxIcon">Not all skins have this field.
     * </div>
     */
    uuid?: string,
    /**
     * The name of the player used for the skin
     * <div class="noteBox warning" style="display:flex">
     *     <img src="../../assets/warning.png", class="noteBoxIcon">Not all skins have this field.
     * </div>
     */
    name?: string,
    /**
     * The URL to the player skin
     */
    url: string
}

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
    | "SPELL_EARTH_DAMAGE_PERCENT"
    | "SPELL_THUNDER_DAMAGE_PERCENT"
    | "SPELL_WATER_DAMAGE_PERCENT"
    | "SPELL_FIRE_DAMAGE_PERCENT"
    | "SPELL_AIR_DAMAGE_PERCENT"
    | "SPELL_EARTH_DAMAGE_RAW"
    | "SPELL_THUNDER_DAMAGE_RAW"
    | "SPELL_WATER_DAMAGE_RAW"
    | "SPELL_FIRE_DAMAGE_RAW"
    | "SPELL_AIR_DAMAGE_RAW"
    | "MAIN_ATTACK_EARTH_DAMAGE_PERCENT"
    | "MAIN_ATTACK_THUNDER_DAMAGE_PERCENT"
    | "MAIN_ATTACK_WATER_DAMAGE_PERCENT"
    | "MAIN_ATTACK_FIRE_DAMAGE_PERCENT"
    | "MAIN_ATTACK_AIR_DAMAGE_PERCENT"
    | "MAIN_ATTACK_EARTH_DAMAGE_RAW"
    | "MAIN_ATTACK_THUNDER_DAMAGE_RAW"
    | "MAIN_ATTACK_WATER_DAMAGE_RAW"
    | "MAIN_ATTACK_FIRE_DAMAGE_RAW"
    | "MAIN_ATTACK_AIR_DAMAGE_RAW"
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
 * A singular identification
 */
export interface Identification {
    /**
     * The name of the identification
     */
    name: IdentificationName,
    /**
     * The base value for the identification
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon"><div>This is only set on {@link Item | Items}.</div>
     * </div>
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
 * An item sprite
 */
export interface Sprite {
    /**
     * The string version of the items ID
     */
    id: MinecraftStringId,
    /**
     * The items numerical ID
     */
    numericalId: number,
    /**
     * The items damage value (data value)
     */
    damage: number
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
     * The durability modifier; only applies to non-consumable items
     */
    durability: number,
    /**
     * The strength requirement modifier;
     * only applies to non-consumable items
     */
    strengthRequirement: number,
    /**
     * The dexterity requirement modifier;
     * only applies to non-consumable items
     */
    dexterityRequirement: number,
    /**
     * The intelligence requirement modifier;
     * only applies to non-consumable items
     */
    intelligenceRequirement: number,
    /**
     * The defence requirement modifier;
     * only applies to non-consumable items
     */
    defenceRequirement: number,
    /**
     * The agility requirement modifier;
     * only applies to non-consumable items
     */
    agilityRequirement: number,
    /**
     * The attack speed modifier;
     * only applies to weapons
     */
    attackSpeed: number,
    /**
     * The powder slot modifier;
     * only applies to armor and weapons
     */
    powderSlots: number,
    /**
     * The duration modifier;
     * only applies to consumables
     */
    duration: number,
    /**
     * The charges modifier;
     * only applies to consumables
     */
    charges: number
}

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
 * A URL to a Wynncraft API resource
 */
export type WynncraftAPIRoute = `https://api.wynncraft.com/${string}` | `https://athena.wynntils.com/${string}`;

/**
 * A scope of leaderboard ranking
 */
export type PlayerLeaderboardScope =
    | "TOTAL"
    | "SOLO";

/**
 * A server type found on Wynncraft
 */
export type WorldType =
    | "WYNNCRAFT"
    | "MEDIA"
    | "OTHER";

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
