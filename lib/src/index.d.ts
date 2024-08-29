
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
 * Returns a raw API response of the requested route.
 * <div class="noteBox important" style="display:flex">
 *     <img src="../../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * @param options The options for the request, or a route to request
 * @category Endpoint
 */
export function fetchRaw(options: RawRequestOptions | WynncraftAPIRoute): Promise<RawResult>

/**
 * Fetches a player from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * <div class="noteBox note" style="display:flex">
 *     <img src="../../assets/note.png", class="noteBoxIcon">This function returns <code>null</code> if the player has never logged into Wynncraft.
 * </div>
 * <div class="noteBox warning" style="display:flex">
 *     <img src="../../assets/warning.png", class="noteBoxIcon">This function may throw a {@link MultipleChoicesError}. Specify a {@link SelectingRequestOptions.multipleChoicesSelector} to avoid these errors
 * </div>
 * @param options The options for the request, or a player name or uuid
 * @category Endpoint
 */
export function fetchPlayer(options: PlayerRequestOptions | string): Promise<Player?>

/**
 * Fetches a players UUID from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * <div class="noteBox note" style="display:flex">
 *     <img src="../../assets/note.png", class="noteBoxIcon">This function returns <code>null</code> if the player has never logged into Wynncraft.
 * </div>
 * @param options The options for the request, or a player name
 * @category Endpoint
 * @deprecated As the UUID endpoint is v2, this function should no longer be used, as the used endpoint has quite a few bugs
 */
export function fetchPlayerUUID(options: PlayerUUIDRequestOptions | string): Promise<UUID?>

/**
 * Fetches the player leaderboard from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * <div class="noteBox note" style="display:flex">
 *     <img src="../../assets/note.png", class="noteBoxIcon">The list is ordered in ascending order of position. (first place at start)
 * </div>
 * @param options The options for the request; or a type of `TOTAL` leaderboard to request
 * @category Endpoint
 * @deprecated Use {@link fetchLeaderboard} instead
 */
export function fetchPlayerLeaderboard(options?: LegacyPlayerLeaderboardRequestOptions | LegacyPlayerTotalLeaderboardType): Promise<List<LegacyLeaderboardPlayer>>

/**
 * Fetches the ability tree of a players character from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * <div class="noteBox important" style="display:flex">
 *     <img src="../../assets/important.png", class="noteBoxIcon">This function throws an error if the player has their profile set to private.
 * </div>
 * <div class="noteBox note" style="display:flex">
 *     <img src="../../assets/note.png", class="noteBoxIcon">This function returns <code>null</code> if the player or character cannot be found.
 * </div>
 * <div class="noteBox warning" style="display:flex">
 *     <img src="../../assets/warning.png", class="noteBoxIcon">This function may throw a {@link MultipleChoicesError}. Specify a {@link SelectingRequestOptions.multipleChoicesSelector} to avoid these errors
 * </div>
 * @param options The options for the request
 * @category Endpoint
 */
export function fetchPlayerCharacterAbilityTree(options: PlayerCharacterAbilityTreeRequestOptions): Promise<PlayerCharacterAbilityTree?>

/**
 * Fetches the ability tree of a class from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * @param options The options for the request
 * @category Endpoint
 */
export function fetchAbilityTree(options: RequestOptionsWithClassType | ClassType): Promise<AbilityTree>

/**
 * Fetches the possible aspects of a class from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * @param options The options for the request
 * @category Endpoint
 */
export function fetchAspects(options: RequestOptionsWithClassType | ClassType): Promise<List<Aspect>>

/**
 * Fetches a guild from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * <div class="noteBox note" style="display:flex">
 *     <img src="../../assets/note.png", class="noteBoxIcon">This function returns <code>null</code> if the guild doesn't exist.
 * </div>
 * <div class="noteBox warning" style="display:flex">
 *     <img src="../../assets/warning.png", class="noteBoxIcon">This function may throw a {@link MultipleChoicesError}. Specify a {@link SelectingRequestOptions.multipleChoicesSelector} to avoid these errors
 * </div>
 * @param options The options for the request, or a guild name to request
 * @category Endpoint
 */
export function fetchGuild(options: GuildRequestOptions | string): Promise<Guild?>

/**
 * Fetches all guild names from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * @param options The options for the request
 * @category Endpoint
 */
export function fetchGuildList(options?: RequestOptions): Promise<List<GuildListItem>>

/**
 * Fetches the guild leaderboard from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * <div class="noteBox note" style="display:flex">
 *     <img src="../../assets/note.png", class="noteBoxIcon">The list is ordered in ascending order of position. (first place at start)
 * </div>
 * @param options The options for the request
 * @category Endpoint
 * @deprecated Use {@link fetchLeaderboard} instead
 */
export function fetchGuildLeaderboard(options?: RequestOptions): Promise<List<LeaderboardGuild>>

/**
 * Fetches the territory list from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * @param options The options for the request
 * @category Endpoint
 */
export function fetchTerritoryList(options?: RequestOptions): Promise<List<Territory>>

/**
 * Fetches all available leaderboard types from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * @param options The options for the request
 * @category Endpoint
 */
export function fetchLeaderboardTypes(options?: RequestOptions): Promise<LeaderboardTypes>

/**
 * Fetches a leaderboard from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * @param options The options for the request
 * @category Endpoint
 */
export function fetchLeaderboard(options?: LeaderboardRequestOptions<GuildLeaderboardType> | GuildLeaderboardType): Promise<List<LeaderboardGuild>>
export function fetchLeaderboard(options?: LeaderboardRequestOptions<PlayerLeaderboardType> | PlayerLeaderboardType): Promise<List<LeaderboardPlayer>>

/**
 * Fetches all ingredients matching the options from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * <div class="noteBox tip" style="display:flex">
 *     <img src="../../assets/tip.png", class="noteBoxIcon">You should never disable caching for this function. Disabling caching or setting low cache times will result in multiple MB of network traffic on every call.
 * </div>
 * @param options The options for the request, or a partial display name to search for
 * @category Endpoint
 */
export function fetchIngredients(options?: IngredientSearchRequestOptions | string): Promise<List<Ingredient>>

/**
 * Fetches all ingredient names from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * @param options The options for the request
 * @category Endpoint
 */
export function fetchIngredientList(options?: RequestOptions): Promise<List<string>>

/**
 * Fetches all recipes matching the options from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * <div class="noteBox tip" style="display:flex">
 *     <img src="../../assets/tip.png", class="noteBoxIcon">You should never disable caching for this function. Disabling caching or setting low cache times will result in multiple MB of network traffic on every call.
 * </div>
 * @param options The options for the request, or a recipe ID
 * @category Endpoint
 */
export function fetchRecipes(options?: RecipeSearchRequestOptions | string): Promise<List<Recipe>>

/**
 * Fetches all recipe names from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * @param options The options for the request
 * @category Endpoint
 */
export function fetchRecipeList(options?: RequestOptions): Promise<List<string>>

/**
 * Fetches all items matching the options from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * <div class="noteBox tip" style="display:flex">
 *     <img src="../../assets/tip.png", class="noteBoxIcon">You should never disable caching for this function. Disabling caching or setting low cache times will result in multiple MB of network traffic on every call.
 * </div>
 * @param options The options for the request, or a partial display name to search for
 * @category Endpoint
 */
export function fetchItems(options?: ItemSearchRequestOptions | string): Promise<List<Item>>

/**
 * Fetches the online players from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * @param options The options for the request
 * @category Endpoint
 */
export function fetchOnlinePlayers(options?: OnlinePlayersRequestOptions | OnlinePlayersIdentifier): Promise<List<World>>

/**
 * Fetches the number of online players from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * @param options The options for the request
 * @category Endpoint
 */
export function fetchOnlinePlayersSum(options?: RequestOptions): Promise<OnlinePlayersSum>

/**
 * Fetches the guild and player names matching this query from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * @param options The options for the request, or a string to search for
 * @category Endpoint
 */
export function fetchNames(options: NameSearchRequestOptions | string): Promise<NameSearch>

/**
 * Fetches the coordinates of important locations from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * @param options The options for the request
 * @category Endpoint
 */
export function fetchMapLocations(options: RequestOptions): Promise<List<MapLocation>>

/**
 * Fetches the coordinates and health info for the locally logged in player from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * <div class="noteBox note" style="display:flex">
 *     <img src="../../assets/note.png", class="noteBoxIcon">Which player to return info for is based on the IP used to cast this request and the IP logged into the Minecraft server.
 * </div>
 * <div class="noteBox note" style="display:flex">
 *     <img src="../../assets/note.png", class="noteBoxIcon">This request returns `null` if no player is logged in.
 * </div>
 * @param options The options for the request
 * @category Endpoint
 */
export function fetchMyLocation(options: RequestOptions): Promise<List<PlayerParty>?>

/**
 * Fetches the number of quests from the API
 * <div class="noteBox important" style="display:flex">
 *     <img src="../../assets/important.png", class="noteBoxIcon">This function causes API requests.
 * </div>
 * @param options The options for the request
 * @category Endpoint
 */
export function fetchQuestCount(options?: RequestOptions): Promise<QuestCount>

/**
 * A collection of static data that is used within
 * the library, but can also be used externally
 */
export var data: LocalData

/**
 * A collection of static data that is used within
 * the library
 */
interface LocalData {
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
     *     <img src="../../assets/note.png", class="noteBoxIcon">Not all sprites are listed here. Ingredient sprites and some special items (currently only "Wybel Paw") don't use sprites from here.
     * </div>
     */
    sprites: Map<ItemSpriteName, Sprite>,
    /**
     * Information on guild level xp requirements
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">The array index represents the level.
     * </div>
     */
    guildLevels: GuildLevelRequirementData[],
    /**
     * Information on rewards unlocked after certain guild levels have been reached (currently outdated except for guild stars and loadout slots)
     */
    guildLevelRewards: GuildLevelRewardData[]
}

/**
 * Information about a majorId
 */
interface MajorIdData {
    /**
     * The Major ID name
     */
    name: string,
    /**
     * The description of the Major ID as it shows up in-game
     */
    description: string
}

/**
 * Information on how to obtain an item
 */
interface ItemDropMeta {
    /**
     * The name of the activity, location or content where this item can be obtained
     */
    source: string;
    /**
     * The type of the activity, location or content where this item can be obtained
     */
    type: string;
    /**
     * If this item belongs to an event, the name of the event
     */
    event: string?;
    /**
     * The coordinates where the item can be obtained, if any
     */
    coordinates: number[]?;
}

/**
 * Additional information for a territory
 */
interface TerritoryData {
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
interface MinecraftIds {
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
interface GuildLevelRequirementData {
    /**
     * The amount of XP required to level to the next level
     * before 1.20 - Gavel Reborn
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">Values above level 87 are just approximations.
     * </div>
     * @deprecated this will be removed in the next major release
     */
    preGavelReborn: number,
    /**
     * The amount of XP required to level to the next level
     * after 1.20 - Gavel Reborn
     * @deprecated this will be removed in the next major release
     */
    postGavelReborn: number,
    /**
     * A number representing the maximum error between the actual raw value
     * of xp and the projected value if using an exact pre Gavel Reborn percentage
     * @deprecated this will be removed in the next major release
     */
    maxError: number,
    /**
     * The amount of XP required to level to the next level
     */
    requirement: number
}

/**
 * Information of guild level rewards
 */
interface GuildLevelRewardData {
    /**
     * The level this reward is unlocked at
     */
    level: number,
    /**
     * The type of the reward
     */
    type: GuildLevelRewardType,
    /**
     * The value of the reward, for guild slots a value of 7 would indicate 7 new slots being gained by that level
     */
    value: number,
    /**
     * This may hold a string value signifying the date when this level reward was last verified in the game
     */
    confirmed: string?
}

/**
 * A type of reward earned by a guild levelling up
 */
type GuildLevelRewardType =
    | "MEMBER_SLOTS"
    | "BADGE_SLOTS"
    | "LOADOUT_SLOTS"
    | "BANK_SLOTS_PUBLIC"
    | "BANK_SLOTS_PRIVATE"
    | "ALLY_SLOTS"
    | "WEEKLY_OBJECTIVES_UNLOCKED"
    | "BADGES"
    | "GUILD_STARS"
    | "TAX";

/**
 * A sprite name commonly used by Wynncraft items
 */
type ItemSpriteName =
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
interface RequestOptions {
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
     * Whether to allow this request to use the cache or ongoing requests if available
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">Requests using cache or other requests do not count towards the ratelimit and return a lot faster.
     * </div>
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
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon"><div>Be aware that each {@link RequestOptions.retries | retry} has it's own timeout, meaning 30,000 ms of timeout may lead to a 90,000 ms wait until a request is rejected on 2 retries.</div>
     * </div>
     */
    timeout?: number,
    /**
     * The amount of time the request should be cached for, overwrites the defaults specified in the config
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
 * Request options for requests which may encounter a MultipleChoicesError
 */
interface SelectingRequestOptions<T> extends RequestOptions {
    /**
     * A function that will be executed with each of the choices as a parameter.
     * It may return a Promise of a boolean. In that case, the selector will be executed for all values simultaneously. And the passing element with the lowest index will be selected.
     * If the selector returns false for all choices, the error is thrown regardless
     * @param v The current choice
     * @param i The index of the current choice
     * @param a The array of all choices
     * @returns True, if the given choice should be selected
     */
    multipleChoicesSelector?: (v: T, i: number, a: T[]) => boolean | Promise<boolean>,
}

/**
 * The options for a raw API request
 */
interface RawRequestOptions extends RequestOptions {
    /**
     * The API route to request
     */
    route: WynncraftAPIRoute
    /**
     * Whether to reuse objects returned by this in other calls to fetchRaw().
     * If you want to modify the return value, you should set this to false.
     * <div class="noteBox important" style="display:flex">
     *     <img src="../../assets/important.png", class="noteBoxIcon">Disabling this hurts performance, but hardens the code against bugs due to downstream code modifying cached objects.
     * </div>
     * @default true
     */
    reuseJson: boolean,
    /**
     * Whether errors or profiles not being found should be
     * filtered out and throw errors/return `null`
     * @default true
     */
    interpret?: boolean,
    /**
     * The expected `version` property, responses with another version will throw an error. This has no effect on v3
     */
    routeVersion?: string | number | null
}

/**
 * The options for a player API request
 */
interface PlayerRequestOptions extends SelectingRequestOptions<PlayerMultipleChoice> {
    /**
     * A player UUID or name; case-insensitive
     */
    player: string,
    /**
     * Whether {@link PlayerRequestOptions.player | player} should be case-sensitive instead; ignored if {@link PlayerRequestOptions.player | player} is a UUID
     * @default false
     * @deprecated As of v3.1.0, this option has no effect.
     */
    forceCaseMatch?: boolean,
    /**
     * Whether to force a {@link fetchPlayerUUID | UUID lookup} before the player request. This can help reduce some errors caused by name changes.
     * Ignored if {@link PlayerRequestOptions.player | player} is a UUID
     * @default false
     * @deprecated As of v3.1.0, this option has no effect.
     */
    forceUUIDLookup?: boolean
}

/**
 * The options for a player API request
 */
interface PlayerUUIDRequestOptions extends RequestOptions {
    /**
     * A player name; case-sensitive
     */
    player: string
}

/**
 * The options for a player character ability tree API request
 */
interface PlayerCharacterAbilityTreeRequestOptions implements RequestOptionsWithClassType, SelectingRequestOptions<PlayerMultipleChoice> {
    /**
     * The players UUID or name, case insensitive
     * <div class="noteBox warning" style="display:flex">
     *     <img src="../../assets/warning.png", class="noteBoxIcon">Currently, the API is not able to handle Multiple Choice cases on this endpoint. Avoid using usernames.
     * </div>
     */
    player: string,
    /**
     * A UUID of a character of the player
     */
    character: string
}

/**
 * The options for an ability tree API request
 */
interface RequestOptionsWithClassType extends RequestOptions {
    /**
     * The class type of the character
     */
    class: ClassType
}

/**
 * The options for a online players API request
 */
interface OnlinePlayersRequestOptions extends RequestOptions {
    /**
     * The identifier to use for players
     * @default "USERNAME"
     */
    identifier: OnlinePlayersIdentifier
}

interface LeaderboardRequestOptions<LbType> extends RequestOptions {
    /**
     * The type of Leaderboard to fetch
     */
    leaderboard: LbType,
    /**
     * The maximum amount of entries, maximum of 1000
     * @default 100
     */
    limit: number
}

/**
 * The options for a player leaderboard API request
 */
interface LegacyPlayerLeaderboardRequestOptions extends RequestOptions {
    /**
     * The scope of the leaderboard; TOTAL means all classes, SOLO means single class
     * @default "TOTAL"
     */
    scope?: LegacyPlayerLeaderboardScope,
    /**
     * The type of level or levels to rank
     * <div class="noteBox tip" style="display:flex">
     *     <img src="../../assets/tip.png", class="noteBoxIcon">Make sure the type is a type in the selected scope.
     * </div>
     * @default "COMBAT"
     */
    type?: LegacyPlayerSoloLeaderboardType | LegacyPlayerTotalLeaderboardType,
}

/**
 * The options for a guild API request
 */
interface GuildRequestOptions extends SelectingRequestOptions<GuildMultipleChoice> {
    /**
     * The UUID of the guild
     * <div class="noteBox important" style="display:flex">
     *     <img src="../../assets/important.png", class="noteBoxIcon">Either this, name or tag has to be defined.
     * </div>
     */
    uuid?: string,
    /**
     * The name of the guild, case insensitive
     * <div class="noteBox important" style="display:flex">
     *     <img src="../../assets/important.png", class="noteBoxIcon">Either this, uuid or tag has to be defined. This is overridden by uuid
     * </div>
     */
    guild?: string,
    /**
     * The tag of the guild, case sensitive
     * <div class="noteBox important" style="display:flex">
     *     <img src="../../assets/important.png", class="noteBoxIcon">Either this, uuid or guild has to be defined. This is overridden by guild and uuid
     * </div>
     */
    tag?: string,
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
interface IngredientSearchRequestOptions extends RequestOptions {
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
interface RecipeSearchRequestOptions extends RequestOptions {
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
interface ItemSearchRequestOptions extends RequestOptions {
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
interface NameSearchRequestOptions extends RequestOptions {
    /**
     * A string to search for
     */
    query: string
}










/**
 * Information on the ratelimits of the API
 */
interface Ratelimit {
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
    totalQueued: number,
    /**
     * The number of requests cast in the past 4 seconds
     */
    recentRequestCount: number,
    /**
     * The number of milliseconds the API took to respond, averaged over recent requests
     */
    ping: number
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
interface RatelimitChannel {
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
interface Config {
    /**
     * The maximum amount of queued requests before
     * new requests are rejected with an error
     * @default 50
     */
    maxQueueLength: number,
    /**
     * Whether to allow requests to use the cache or currently ongoing requests
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">This is overridden by {@link RequestOptions.allowCache}.
     * </div>
     * @default true
     */
    allowCacheByDefault: boolean,
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
     * Whether exceeding the ratelimit should throw an error, or whether the request should be retried after the ratelimit reset
     * @default false
     */
    throwOnRatelimitError: boolean,
    /**
     * Information on all supported routes
     */
    routes: Routes
}

/**
 * The options to set the config to
 */
interface ConfigOptions {
    /**
     * How many request should be allowed to be queued
     * before the wrapper rejects new requests with an error
     */
    maxQueueLength?: number,
    /**
     * Whether to allow requests to use the cache or currently ongoing requests.
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">This is overridden by {@link RequestOptions.allowCache}.
     * </div>
     */
    allowCacheByDefault?: boolean,
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
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon"><div>Be aware that each {@link ConfigOptions.defaultRetries | retry} has it's own timeout, meaning 30,000 ms of timeout may lead to a 90,000 ms wait until a request is rejected on 2 retries.</div>
     * </div>
     */
    defaultTimeout?: number,
    /**
     * Whether exceeding the ratelimit should throw an error, or whether the request should be retried after the ratelimit reset
     */
    throwOnRatelimitError?: boolean,
    /**
     * The amount of milliseconds to cache requests of these routes for
     */
    defaultCacheTimes?: CacheTimeOptions
}

/**
 * An API Key
 */
interface ApiKey {
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

// TODO: new routes
/**
 * Stores information on all possible routes
 */
interface Routes {
    ABILITY_TREE: Route,
    ABILITY_MAP: Route,
    PLAYER_CHARACTER_AT: Route,
    PLAYER: Route,
    PLAYER_UUID: Route,
    PLAYER_LEADERBOARD: Route,
    LEADERBOARDS: Route,
    GUILD: Route,
    GUILD_LIST: Route,
    TERRITORY_LIST: Route,
    INGREDIENT_SEARCH: Route,
    INGREDIENT_LIST: Route,
    RECIPE_SEARCH: Route,
    RECIPE_LIST: Route,
    ITEMS: Route,
    SEARCH: Route,
    ONLINE_PLAYERS: Route,
    MAP_LOCATIONS: Route,
    MY_LOCATION: Route,
    QUEST_COUNT: Route
}

/**
 * A singular route to the API
 */
interface Route {
    /**
     * The URL of the route
     */
    url: WynncraftAPIRoute,
    /**
     * The amount of milliseconds to cache data from this route for
     */
    cacheTime: number,
    /**
     * The API version of this route the wrapper was build for, v3 routes do not have a version
     */
    version: SemanticVersion | number | null;
}

/**
 * The different versions of the API
 */
type APIVersion = "legacy" | "v2" | "v3";

/**
 * Options specifying cache times for routes
 */
interface CacheTimeOptions {
    ABILITY_TREE?: number,
    ABILITY_MAP?: number,
    PLAYER_CHARACTER_AT?: number,
    PLAYER?: number,
    PLAYER_UUID?: number,
    PLAYER_LEADERBOARD?: number,
    LEADERBOARDS?: number,
    GUILD?: number,
    GUILD_LIST?: number,
    TERRITORY_LIST?: number,
    INGREDIENT_SEARCH?: number,
    INGREDIENT_LIST?: number,
    RECIPE_SEARCH?: number,
    RECIPE_LIST?: number,
    ITEMS?: number,
    SEARCH?: number,
    ONLINE_PLAYERS?: number,
    MAP_LOCATIONS?: number,
    MY_LOCATION?: number,
    QUEST_COUNT?: number
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
interface IdentificationQuery {
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
     * The Spell Damage % identification has to
     * have possible values within this range
     */
    spellDamagePercent?: OpenRange,
    /**
     * The Earth Spell Damage % identification has to
     * have possible values within this range
     */
    spellEarthDamagePercent?: OpenRange,
    /**
     * The Thunder Spell Damage % identification has to
     * have possible values within this range
     */
    spellThunderDamagePercent?: OpenRange,
    /**
     * The Water Spell Damage % identification has to
     * have possible values within this range
     */
    spellWaterDamagePercent?: OpenRange,
    /**
     * The Fire Spell Damage % identification has to
     * have possible values within this range
     */
    spellFireDamagePercent?: OpenRange,
    /**
     * The Air Spell Damage % identification has to
     * have possible values within this range
     */
    spellAirDamagePercent?: OpenRange,
    /**
     * The Neutral Spell Damage % identification has to
     * have possible values within this range
     */
    spellNeutralDamagePercent?: OpenRange,
    /**
     * The Elemental Spell Damage % identification has to
     * have possible values within this range
     */
    spellElementalDamagePercent?: OpenRange,
    /**
     * The Raw Spell Damage identification has to
     * have possible values within this range
     */
    spellDamageRaw?: OpenRange,
    /**
     * The Raw Earth Spell Damage identification has to
     * have possible values within this range
     */
    spellEarthDamageRaw?: OpenRange,
    /**
     * The Raw Thunder Spell Damage identification has to
     * have possible values within this range
     */
    spellThunderDamageRaw?: OpenRange,
    /**
     * The Raw Water Spell Damage identification has to
     * have possible values within this range
     */
    spellWaterDamageRaw?: OpenRange,
    /**
     * The Raw Fire Spell Damage identification has to
     * have possible values within this range
     */
    spellFireDamageRaw?: OpenRange,
    /**
     * The Raw Air Spell Damage identification has to
     * have possible values within this range
     */
    spellAirDamageRaw?: OpenRange,
    /**
     * The Raw Neutral Spell Damage identification has to
     * have possible values within this range
     */
    spellNeutralDamageRaw?: OpenRange,
    /**
     * The Raw Elemental Spell Damage identification has to
     * have possible values within this range
     */
    spellElementalDamageRaw?: OpenRange,
    /**
     * The Main Attack Damage % identification has to
     * have possible values within this range
     */
    mainAttackDamagePercent?: OpenRange,
    /**
     * The Earth Main Attack Damage % identification has to
     * have possible values within this range
     */
    mainAttackEarthDamagePercent?: OpenRange,
    /**
     * The Thunder Main Attack Damage % identification has to
     * have possible values within this range
     */
    mainAttackThunderDamagePercent?: OpenRange,
    /**
     * The Water Main Attack Damage % identification has to
     * have possible values within this range
     */
    mainAttackWaterDamagePercent?: OpenRange,
    /**
     * The Fire Main Attack Damage % identification has to
     * have possible values within this range
     */
    mainAttackFireDamagePercent?: OpenRange,
    /**
     * The Air Main Attack Damage % identification has to
     * have possible values within this range
     */
    mainAttackAirDamagePercent?: OpenRange,
    /**
     * The Neutral Main Attack Damage % identification has to
     * have possible values within this range
     */
    mainAttackNeutralDamagePercent?: OpenRange,
    /**
     * The Elemental Main Attack Damage % identification has to
     * have possible values within this range
     */
    mainAttackElementalDamagePercent?: OpenRange,
    /**
     * The Raw Main Attack Damage identification has to
     * have possible values within this range
     */
    mainAttackDamageRaw?: OpenRange,
    /**
     * The Raw Earth Main Attack Damage identification has to
     * have possible values within this range
     */
    mainAttackEarthDamageRaw?: OpenRange,
    /**
     * The Raw Thunder Main Attack Damage identification has to
     * have possible values within this range
     */
    mainAttackThunderDamageRaw?: OpenRange,
    /**
     * The Raw Water Main Attack Damage identification has to
     * have possible values within this range
     */
    mainAttackWaterDamageRaw?: OpenRange,
    /**
     * The Raw Fire Main Attack Damage identification has to
     * have possible values within this range
     */
    mainAttackFireDamageRaw?: OpenRange,
    /**
     * The Raw Air Main Attack Damage identification has to
     * have possible values within this range
     */
    mainAttackAirDamageRaw?: OpenRange,
    /**
     * The Raw Neutral Main Attack Damage identification has to
     * have possible values within this range
     */
    mainAttackNeutralDamageRaw?: OpenRange,
    /**
     * The Raw Elemental Main Attack Damage identification has to
     * have possible values within this range
     */
    mainAttackElementalDamageRaw?: OpenRange,
    /**
     * The Damage % identification has to
     * have possible values within this range
     */
    damagePercent?: OpenRange,
    /**
     * The Earth Damage % identification has to
     * have possible values within this range
     */
    earthDamagePercent?: OpenRange,
    /**
     * The Thunder Damage % identification has to
     * have possible values within this range
     */
    thunderDamagePercent?: OpenRange,
    /**
     * The Water Damage % identification has to
     * have possible values within this range
     */
    waterDamagePercent?: OpenRange,
    /**
     * The Fire Damage % identification has to
     * have possible values within this range
     */
    fireDamagePercent?: OpenRange,
    /**
     * The Air Damage % identification has to
     * have possible values within this range
     */
    airDamagePercent?: OpenRange,
    /**
     * The Neutral Damage % identification has to
     * have possible values within this range
     */
    neutralDamagePercent?: OpenRange,
    /**
     * The Elemental Damage % identification has to
     * have possible values within this range
     */
    elementalDamagePercent?: OpenRange,
    /**
     * The Raw Damage identification has to
     * have possible values within this range
     */
    damageRaw?: OpenRange,
    /**
     * The Raw Earth Damage identification has to
     * have possible values within this range
     */
    earthDamageRaw?: OpenRange,
    /**
     * The Raw Thunder Damage identification has to
     * have possible values within this range
     */
    thunderDamageRaw?: OpenRange,
    /**
     * The Raw Water Damage identification has to
     * have possible values within this range
     */
    waterDamageRaw?: OpenRange,
    /**
     * The Raw Fire Damage identification has to
     * have possible values within this range
     */
    fireDamageRaw?: OpenRange,
    /**
     * The Raw Air Damage identification has to
     * have possible values within this range
     */
    airDamageRaw?: OpenRange,
    /**
     * The Raw Neutral Damage identification has to
     * have possible values within this range
     */
    neutralDamageRaw?: OpenRange,
    /**
     * The Raw Elemental Damage identification has to
     * have possible values within this range
     */
    elementalDamageRaw?: OpenRange,
    /**
     * The Raw Critical Damage identification has to
     * have possible values within this range
     */
    criticalDamageRaw?: OpenRange,
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
    stealing?: OpenRange,
    /**
     * The Knockback identification has to
     * have possible values within this range
     */
    knockback?: OpenRange,
}

/**
 * A crafting profession filter to match when requesting ingredients
 */
interface CraftingSkillQuery {
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
interface PositionModifierQuery {
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
interface ItemRequirementQuery {
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
    class?: ClassBaseType,
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
interface MajorIdQuery {
    /**
     * Whether the item has to have all major IDs, or if any are sufficient
     * @default true
     */
    requireAll?: boolean,

    /**
     * A list of Major IDs to look for
     */
    list: string[]
}

/**
 * A stat filter to match when requesting items
 * <div class="noteBox tip" style="display:flex">
 *     <img src="../../assets/tip.png", class="noteBoxIcon">Values must be integer.
 * </div>
 */
interface ItemStatQuery {
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
 * A visual sprite to match in ingredient or item search; one of the properties has to be defined
 */
interface SpriteQuery {
    /**
     * The ID of the sprite
     */
    id?: MinecraftId,
    /**
     * The damage value (or data value) of the sprite; this only matches sprites of LEGACY type
     */
    damage?: number,
    /**
     * The customModelData value of the sprite; this only matches sprites of ATTRIBUTE type
     */
    customModelData?: number,
    /**
     * The name of the sprite; this only matches sprites of ATTRIBUTE type
     */
    name?: string,
}

/**
 * A filter for restricted IDs to match when searching for ingredients
 * <div class="noteBox tip" style="display:flex">
 *     <img src="../../assets/tip.png", class="noteBoxIcon">Values for ID bounds have to be integer.
 * </div>
 */
interface RestrictedIdQuery {
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
 * The object returned by fetchRaw requests
 */
interface RawResult {
    /**
     * The timestamp the request was cast at. This timestamp is measured using the local clock.
     */
    requestedAt: number,
    /**
     * The timestamp the response was served. This timestamp is measured using the API server's clock.
     */
    respondedAt: number,
    /**
     * The timestamp the response was received at. This timestamp is measured using the local clock.
     */
    receivedAt: number,
    /**
     * The timestamp the data was created at. This timestamp is measured using the API server's clock.
     */
    dataTimestamp: number,
    /**
     * The HTTP response status code
     */
    status: number,
    /**
     * The response headers
     */
    headers: any,
    /**
     * The response body
     */
    body: any
}

/**
 * A choice used by MultipleChoicesErrors on player requests
 */
interface PlayerMultipleChoice {
    /**
     * The players UUID
     */
    uuid: string,
    /**
     * The players name
     * <div class="noteBox important" style="display:flex">
     *     <img src="../../assets/important.png", class="noteBoxIcon">Usually, MultipleChoicesErrors occur because player names are not updated consistently. The names are likely to match for all choices.
     * </div>
     */
    name: string,
    /**
     * The players rank
     */
    rank: RankData,
    /**
     * Fetches the player of this choice
     */
    fetch: (options?: PlayerRequestOptions) => Promise<Player>
}

/**
 * A choice used by MultipleChoicesErrors on guild requests
 */
interface GuildMultipleChoice {
    /**
     * The UUID of the guild
     */
    uuid: string,
    /**
     * The guild name
     */
    name: string,
    /**
     * The guild tag
     */
    tag: string,
    /**
     * The guild level
     */
    level: number,
    /**
     * The guild member count
     */
    memberCount: number,
    /**
     * The guilds creation date
     */
    created: Date,
    /**
     * The guilds creation timestamp
     */
    createdTimestamp: number
    /**
     * Fetches the guild of this choice
     */
    fetch: (options?: GuildRequestOptions) => Promise<Guild>
}









/**
 * Represents an Error that occured in the Wynncraft API
 * @category Errors
 */
export class WynncraftAPIError extends Error {
    public constructor(message?: string);
}

/**
 * Represents that multiple entries were found.
 * Use the fetch function to request the chosen options
 * @category Errors
 */
export class MultipleChoicesError<T extends { fetch: (options?: RequestOptions) => Promise<V> }> extends WynncraftAPIError {
    public constructor(message?: string, choices?: T[]);

    /**
     * An array of the options that the query matched
     */
    public choices: T[];
}

/**
 * Represents the basis of all objects returned by API requests
 */
export class BaseAPIObject {
    public constructor(requestedAt: number, respondedAt: number, receivedAt: number, timestamp: number, apiVersion: SemanticVersion, libVersion: SemanticVersion, source: WynncraftAPIRoute);

    /**
     * The unix timestamp indicating when this request was sent
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">This is measured using the local clock.
     * </div>
     * <div class="noteBox warning" style="display:flex">
     *     <img src="../../assets/warning.png", class="noteBoxIcon">If the response was returned from cache, then requestedAt, respondedAt and receivedAt may be in the past.
     * </div>
     */
    public requestedAt: number;
    /**
     * The unix timestamp indicating when this request was responded to by the API
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">This is measured using the API server's clock.
     * </div>
     * <div class="noteBox warning" style="display:flex">
     *     <img src="../../assets/warning.png", class="noteBoxIcon">If the response was returned from cache, then requestedAt, respondedAt and receivedAt may be in the past.
     * </div>
     */
    public respondedAt: number;
    /**
     * The unix timestamp indicating when this request was received
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">This is measured using the local clock.
     * </div>
     * <div class="noteBox warning" style="display:flex">
     *     <img src="../../assets/warning.png", class="noteBoxIcon">If the response was returned from cache, then requestedAt, respondedAt and receivedAt may be in the past.
     * </div>
     */
    public receivedAt: number;
    /**
     * The unix timestamp indicating when the data of this request was created
     * <div class="noteBox tip" style="display:flex">
     *     <img src="../../assets/tip.png", class="noteBoxIcon">You can use this timestamp to determine how old a piece of data is.
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
     * The query used for this search
     */
    public query: string;
    /**
     * The guild names including the search pattern in their name
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">Ordered in ascending order of creation date.
     * </div>
     */
    public guilds: GuildListItem[];
    /**
     * The guilds where the search pattern appeared in the tag
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">Ordered in ascending order of creation date.
     * </div>
     */
    public guildTags: GuildListItem[];
    /**
     * The players whose name begins with the query
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">Ordered approximately lexicographically.
     * </div>
     */
    public players: PlayerIdentifier[];
    /**
     * The items whose names contain the query string
     */
    public items: Item[];
    /**
     * The territories whose names start with the query string
     */
    public territories: TerritoryStub[];
    /**
     * The discoveries whose names start with the query string
     */
    public discoveries: DiscoveryStub[];
}

/**
 * Represents an important location on the Wynncraft map
 */
export class MapLocation {
    private constructor(v: Object);

    /**
     * The name of the location
     */
    public name: string;
    /**
     * The icon the Wynncraft map uses to display this location
     */
    public icon: string;
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
     * <div class="noteBox warning" style="display:flex">
     *     <img src="../../assets/warning.png", class="noteBoxIcon">This can be null if the player just went offline
     * </div>
     */
    public world: string?;
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
     * The UUID of the class the player is currently using
     */
    public character: string;
    /**
     * The class nickname of the player, if available
     */
    public nickname: string?;
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
     * The relationship this party member has to the self player
     */
    public relationship: PlayerRelationship;

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
    public majorId: MajorIdData;
    /**
     * The player head skin this item uses
     */
    public skin: ItemSkin?;
    /**
     * Whether the item is pre-identified (i.e. items bought from merchants)
     */
    public identified: boolean;
    /**
     * Information on how to obtain this item
     */
    public obtaining: ItemDropMeta;
}

/**
 * Represents a class of a player
 */
export class PlayerClass {
    private constructor(data: any);

    /**
     * The uuid of the class
     */
    public uuid: string;
    /**
     * The nickname of the class, if exists
     */
    public nickname: string?;
    /**
     * The base type of class
     */
    public baseType: ClassBaseType;
    /**
     * The type of the class
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
     * The playtime of the class in minutes
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">See {@link Player.minutesPlayed}
     * </div>
     */
    public minutesPlayed: number;
    /**
     * The playtime of this class in its native unit
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">See {@link Player.playtime}
     * </div>
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
     * The amount of wars participated in on this class
     */
    public wars: number;
    /**
     * The amount of chests opened on this class
     */
    public chestsOpened: number;
    /**
     * Whether this class has reached combat level 101 before the Economy
     * Update 1.18 released
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">Classes with this flag display a star next to their level in chat.
     * </div>
     */
    public hasEconomyStar: boolean;

    /**
     * Fetches the characters ability tree
     * @param options The options for the request, the `player`, `character` and `class` fields have no effect
     */
    public fetchAbilityTree(options: PlayerCharacterAbilityTreeRequestOptions): Promise<PlayerCharacterAbilityTree?>
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
     * Whether the player has their profile set to public. If false, ability tree lookups will fail and skillpoints will be null
     */
    public publicProfile: boolean;
    /**
     * The last character this player has used, if available
     */
    public lastCharacter: PlayerClass?;
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
     * The playtime of the player in minutes
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">Accurate down to 5 minutes. Same restrictions as with {@link Player.playtime | playtime} apply.
     * </div>
     */
    public minutesPlayed: number;
    /**
     * The playtime of the player in its native unit
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">The playtime unit is 5 minutes. Be aware that playtime is affected by server lag and other factors.
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
     * The total amount of times the player has run specific dungeons
     */
    public dungeons: RepeatableContent[];
    /**
     * The total amount of times the player has run specific dungeons, including on deleted classes
     */
    public dungeonsIncludingDeleted: RepeatableContent[];
    /**
     * The total amount of times the player has run specific raids
     */
    public raids: RepeatableContent[];
    /**
     * The total amount of times the player has run specific raids, including on deleted classes
     */
    public raidsIncludingDeleted: RepeatableContent[];
    /**
     * The classes of the player
     */
    public classes: PlayerClass[];
    /**
     * The total amount of wars the player has participated in
     */
    public wars: number;
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
     * The leaderboard rankings of the player in all player leaderboards (see {@link fetchLeaderboardTypes}), only the leaderboards where the player is in the top 3,000,000 are set.
     */
    public ranking: { [K in PlayerLeaderboardType]: number }
    /**
     * The leaderboard rankings of the player in all player leaderboards (see {@link fetchLeaderboardTypes}) from the previous day. This works the same as {@link Player.ranking | ranking} but always displays the value rankings had before the last update.
     */
    public previousRanking: { [K in PlayerLeaderboardType]: number }
    /**
     * The ID of the linked forum member, if available
     */
    public forumId: number?;
}

/**
 * Represents a player from the leaderboards API
 */
export class LeaderboardPlayer {
    private constructor(v: object);

    /**
     * The UUID of the player
     */
    public uuid: string;
    /**
     * The username of the player
     */
    public name: string;
    /**
     * The metric this leaderboard tracks
     */
    public score: number;
    /**
     * The playtime of the player or the character in minutes
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">See {@link Player.minutesPlayed}
     * </div>
     */
    public minutesPlayed: number;
    /**
     * The playtime of the player or the character in its native unit
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">See {@link Player.playtime}
     * </div>
     */
    public playtime: number;
    /**
     * The amount of overflow XP the player has. Only present for solo leaderboards or leaderboards that track a level.
     */
    public xp: number?;
    /**
     * The respective level, such as of the challenge class or the accumulated level of all classes on global leaderboards.
     * Currently this property is `null` on hardcoreContent, huicContent and huichContent.
     */
    public level: number?;
    /**
     * Information on the character, if applicable
     */
    public character: LeaderboardPlayerCharacter?;
    /**
     * The players rank
     */
    public rank: RankData;
}

/**
 * Represents the types of leaderboards available on the API
 */
export class LeaderboardTypes extends BaseAPIObject {
    private constructor(rawResult: RawResult, params: any);

    /**
     * The available guild leaderboards
     */
    public guildLeaderboards: AvailableLeaderboard<GuildLeaderboardType, LeaderboardGuild>;
    /**
     * The available player leaderboards
     */
    public playerLeaderboards: AvailableLeaderboard<PlayerLeaderboardType, LeaderboardPlayer>;
}

/**
 * Represents a player characters ability tree
 */
export class PlayerCharacterAbilityTree extends AbilityTree {
    private constructor(rawResult: RawResult, params: any);

    /**
     * The UUID of the player
     */
    public player: string;
    /**
     * The UUID of the character
     */
    public character: string;
    /**
     * The number of pages with unlocked abilities in this ability tree
     */
    public pages: number;
    /**
     * The unlocked abilities on this characters ability tree
     */
    public unlockedAbilities: Ability[];
    /**
     * The unlocked nodes on this characters ability tree
     */
    public unlockedNodes: (Ability | AbilityConnectorNode)[]
}

/**
 * Represents the generic ability tree of a class
 */
export class AbilityTree extends BaseAPIObject {
    private constructor(rawTree: RawResult, rawMap: RawResult, params: any);

    /**
     * The type of class this ability tree belongs to
     */
    public classBaseType: ClassBaseType;
    /**
     * The archetypes on this class' ability tree
     */
    public archetypes: Archetype[];
    /**
     * The abilities on this class' ability tree
     */
    public abilities: Ability[];
    /**
     * The nodes that make up this class' ability tree
     */
    public map: (Ability | AbilityConnectorNode)[];
}

/**
 * An ability from the ability tree
 */
export class Ability {
    private constructor(data: any);

    /**
     * The ID of the ability
     */
    public id: string;
    /**
     * The name of the ability, includes formatting codes
     */
    public name: string;
    /**
     * The description of the ability, includes formatting codes
     */
    public description: string;
    /**
     * The abilities leading to this one
     */
    public parents: Ability[];
    /**
     * The abilities reachable from this one
     */
    public children: Ability[];
    /**
     * The cost to unlock the ability, in ability points
     */
    public cost: number;
    /**
     * The ability required to unlock this one, if exists. This is used for things like upgrades to a spell only being possible if the spell was unlocked.
     */
    public requiredAbility: Ability?;
    /**
     * The archetype restriction, if one exists
     */
    public archetypeRequirement: ArchetypeRequirement?;
    /**
     * The abilities locked by this one
     */
    public locks: Ability[];
    /**
     * The abilities that lock this one
     */
    public lockedBy: Ability[];
    /**
     * The location of this ability on a rendered tree
     */
    public location: AbilityNodeLocation;
    /**
     * The sprite used for this ability
     */
    public sprite: Sprite;
    /**
     * The CDN URL used to access the image of the sprite for display purposes
     */
    public passiveIconUrl: string;
    /**
     * The CDN URL used to access the image of the sprite for display purposes
     */
    public activeIconUrl: string;
}

/**
 * A connector ability tree node
 */
export class AbilityConnectorNode {
    private constructor(data: any);

    /**
     * The abilities this connector is connecting. There can be more than 2 elements in this array
     */
    public links: Ability[];
    /**
     * The location of this node on a rendered tree
     */
    public location: AbilityNodeLocation;
    /**
     * The type of connection this is
     */
    public direction: ConnectorDirection;
    /**
     * The CDN URL used to access the image of the sprite for display purposes
     */
    public passiveIconUrl: string;
    /**
     * The CDN URL used to access the image of the sprite for display purposes
     */
    public activeIconUrl: string;
}

/**
 * An Aspect
 */
export class Aspect {
    private constructor(data: any);

    /**
     * The Aspect's name
     */
    public name: string;
    /**
     * The rarity of the Aspect
     */
    public rarity: ItemRarity;
    /**
     * The class this Aspect is restricted to
     */
    public class: ClassBaseType;
    /**
     * The Aspect's tiers
     */
    public tiers: AspectTier[];
    /**
     * The Aspect's sprite
     */
    public sprite: Sprite;
    /**
     * The CDN URL of an image used for display of the Aspect
     */
    public iconUrl: string;
}

/**
 * Represents a player UUID from the API
 */
export class UUID extends BaseAPIObject {
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
     * Fetches the player stats of the guild member
     * <div class="noteBox important" style="display:flex">
     *     <img src="../../assets/important.png", class="noteBoxIcon">This method causes API requests.
     * </div>
     * @param options The options for the request; the `player` field has no effect
     */
    public fetch(options?: PlayerRequestOptions): Promise<Player>;
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
     * The name of the world the player is online on, if any
     */
    public world: string?;

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
     * The UUID of the guild
     */
    public uuid: string;
    /**
     * The name of the guild
     */
    public name: string;
    /**
     * The tag of the guild
     */
    public tag: string;
    /**
     * The amount of guild stars displayed in front of the guild's tag in chat
     */
    public stars: number;
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
     * The XP percentage of the guilds current level;
     * Usually a number between 0 and 1
     * <div class="noteBox warning" style="display:flex">
     *     <img src="../../assets/warning.png", class="noteBoxIcon"><div>This number may be more than 1 as levelling up takes a couple minutes. Use <code>Guild#levelprogression</code> instead to get a safe percentage factor.</div>
     * </div>
     */
    public xp: number;
    /**
     * The progress of the guild to the next level
     * as a number between 0 and 1
     */
    public levelProgression: number;
    /**
     * The raw amount of xp the guild has towards the next level; this amount is not exact, refer to {@link Guild.xpRawLower} and {@link Guild.xpRawLower} for the lower and upper bound
     */
    public xpRaw: number;
    /**
     * The lower bound of raw xp the guild has
     */
    public xpRawLower: number;
    /**
     * The upper bound of raw xp the guild has
     */
    public xpRawUpper: number;
    /**
     * The total amount of XP required for the guild's current level
     */
    public xpRequired: number;
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
     * The maximum member count of the guild (currently uses outdated data)
     */
    public memberSlots: number;
    /**
     * The amount of currently online members
     */
    public onlineMembers: number;
    /**
     * The banner data of the guild
     */
    public banner: BannerData;
    /**
     * The placement in all seasons the guild participated in
     */
    public seasonRanks: SeasonRank[]

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
 * Represents the name and tag of a guild
 */
export class GuildListItem {
    private constructor(v: Object);

    /**
     * The UUID of the guild
     */
    public uuid: string;
    /**
     * The name of the guild
     */
    public name: string;
    /**
     * The tag of the guild
     */
    public tag: string;
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
     */
    public guild: string?;
    /**
     * The UUID of the guild holding the territory; `null` if no guild owns the territory
     */
    public guildUUID: string?;
    /**
     * The tag of the guild holding the territory; `null` if no guild owns the territory
     */
    public guildTag: string?;
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
    public location: RectangleLocation;
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
export class LegacyLeaderboardPlayer {
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
    public rank: LegacyRankData;
    /**
     * The playtime of the player
     */
    public playtime: number;
    /**
     * The class that earns the player their spot on the
     * leaderboard
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon"><div>Only set if the requested {@link LegacyPlayerLeaderboardScope | scope} was <code>SOLO</code></div>.
     * </div>
     */
    public class?: LegacyLeaderboardPlayerClass;
    /**
     * The respective level of the player
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">Only set if the type of the request wasn't <code>PVP</code>.
     * </div>
     */
    public level?: number;
    /**
     * The additional XP the player has gathered beyond their current level
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">Only set if the type of the request wasn't <code>PVP</code>.
     * </div>
     */
    public xp?: number;
    /**
     * The nether kills of the player
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon"><div>Only set if the {@link LegacyPlayerTotalLeaderboardType | type} of the request was <code>PVP</code></div>.
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
     * The UUID of the guild
     */
    public uuid: string;
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
     * An array of player names or UUIDs who are online on the world
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
 * Represents the sum of quests currently in the game
 */
export class QuestCount extends BaseAPIObject {
    private constructor(data: Object, params: Object);

    /**
     * The amount of quests
     */
    public quests: number;
}










/**
 * A <a href="https://semver.org/" target="_blank">semantic version identifier</a>
 */
type SemanticVersion = `${number}.${number}.${number}`;

/**
 * A value resolvable to a minecraft item id
 */
type MinecraftId = MinecraftStringId | number;

/**
 * A value resolvable to a minecraft item id in string form
 */
type MinecraftStringId = `minecraft:${string}`;

/**
 * A range containing numbers between certain threshholds,
 * or above/below a threshhold if only one is given
 * <div class="noteBox note" style="display:flex">
 *     <img src="../../assets/note.png", class="noteBoxIcon">Some input fields for OpenRanges may require integers.
 * </div>
 */
interface OpenRange {
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
interface Range {
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
 * A server type found on Wynncraft
 */
type WorldType =
    | "WYNNCRAFT"
    | "MEDIA"
    | "OTHER";

/**
 * A type of leaderboard for players
 */
type PlayerLeaderboardType = string;

/**
 * A type of leaderboard for guilds
 */
type GuildLeaderboardType = `guild${string}`;

/**
 * A type of leaderboard which can be fetched
 */
interface AvailableLeaderboard<LbType, LbEntryType> {
    /**
     * The name of the leaderboard
     */
    name: LbType,
    /**
     * Fetches the leaderboard
     */
    fetch: (options: LeaderboardRequestOptions<LbType>) => Promise<List<LbEntryType>>
}

/**
 * The character of a player on the leaderboard
 */
interface LeaderboardPlayerCharacter {
    /**
     * The UUID of the character
     */
    uuid: string,
    /**
     * The type of class excluding reskins
     */
    baseType: ClassBaseType,
    /**
     * The type of class including reskins
     */
    type: ClassType,
    /**
     * The nickname of the character, if applicable
     */
    nickname: string?,
    /**
     * Fetches the characters ability tree
     * @param options The request options, the fields `player`, `character` and `class` have no effect
     */
    fetchAbilityTree: (options: PlayerCharacterAbilityTreeRequestOptions) => Promise<PlayerCharacterAbilityTree?>
}

/**
 * A class of a player on the leaderboard
 */
interface LegacyLeaderboardPlayerClass {
    /**
     * The uuid of the class
     */
    public uuid: string,
    /**
     * The {@link ClassBaseType | base type} of the class
     */
    public baseType: ClassBaseType,
    /**
     * The {@link ClassType | type} of the class
     */
    public type: ClassType
}

/**
 * The uuid and name of a player
 */
interface PlayerIdentifier {
    /**
     * The UUID of the player
     */
    public uuid: string,
    /**
     * The name of the player
     */
    public name: string,
    /**
     * Fetches the player
     */
    public fetch: (options?: PlayerRequestOptions) => Promise<Player?>
}

/**
 * The relationship between two players, self overrides friend overrides party overrides guild.
 */
type PlayerRelationship = "SELF" | "FRIEND" | "PARTY" | "GUILD";

/**
 * A scope of leaderboard ranking
 */
type LegacyPlayerLeaderboardScope =
    | "TOTAL"
    | "SOLO";

/**
 * Player leaderboards available for total
 */
type LegacyPlayerTotalLeaderboardType =
    | "PVP"
    | "COMBAT"
    | "PROFESSION"
    | "COMBINED";

/**
 * Player leaderboards available for solo
 */
type LegacyPlayerSoloLeaderboardType =
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
 * A type of player class excluding the reskins
 */
type ClassBaseType =
    | "ARCHER"
    | "ASSASSIN"
    | "MAGE"
    | "SHAMAN"
    | "WARRIOR";

/**
 * A type of player class
 */
type ClassType = ClassBaseType
    | "DARK_WIZARD"
    | "HUNTER"
    | "KNIGHT"
    | "NINJA"
    | "SKYSEER";

/**
* Holds ClassLevelData for all levels on a class
*/
interface ClassLevelsData {
    /**
     * The combat level of the class
     */
    combat: ClassLevelDataWithRaw,
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
 * Contains the information of one level, including raw xp
 */
interface ClassLevelDataWithRaw {
    /**
     * The whole level
     */
    level: number,
    /**
     * The XP percentage, expressed as a number between 0 and 1
     */
    xp: number,
    /**
     * The raw xp amount
     */
    xpRaw: number
}

/**
* Contains the information of one level
*/
interface ClassLevelData {
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
interface RepeatableContent {
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
interface SkillPoints {
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
interface Gamemodes {
    /**
     * Whether the class is in Hardcore mode
     */
    hardcore: boolean,
    /**
     * Whether the class is in Ironman mode
     */
    ironman: boolean,
    /**
     * Whether the class is in Ultimate Ironman mode
     */
    ultimateIronman: boolean,
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
interface PvpData {
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
type ServerRank =
    | "ADMINISTRATOR"
    | "WEBDEV"
    | "MODERATOR"
    | "MEDIA"
    | "BUILDER"
    | "ITEM"
    | "GAME MASTER"
    | "CMD"
    | "MUSIC"
    | "HYBRID"
    | "MEDIA"
    | "PLAYER";

/**
* A donator rank on Wynncraft
*/
type DonatorRank =
    | "CHAMPION"
    | "HERO"
    | "VIP+"
    | "VIP";

/**
* Holds information about player ranks
*/
interface RankData {
    /**
     * The players server rank
     */
    serverRank: ServerRank,
    /**
     * The players server ranks short version, if available
     * <div class="noteBox warning" style="display:flex">
     *     <img src="../../assets/warning.png", class="noteBoxIcon">This property does not consistently shorten ranks across different endpoints.
     * </div>
     */
    shortenedServerRank: string,
    /**
     * The players donator rank
     */
    donatorRank: DonatorRank?,
    /**
     * Whether the player is a veteran
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon">The Wynncraft criteria for a veteran is whether the player has bought a rank before the 2014 Minecraft EULA change.
     * </div>
     * <div class="noteBox warning" style="display:flex">
     *     <img src="../../assets/warning.png", class="noteBoxIcon">Not all veteran players are always displayed as such.
     * </div>
     */
    veteran: boolean,
    /**
     * The text color of the players rank badge
     */
    textColor: string?,
    /**
     * The background color of the players rank badge
     */
    backgroundColor: string?,
    /**
     * The cdn URL of the players rank badge
     */
    badgeUrl: string?
}

/**
 * RankData used on the v2 leaderboards
 */
interface LegacyRankData {
    /**
     * The server rank of the player
     */
    serverRank: ServerRank,
    /**
     * The donator rank of the player
     */
    donatorRank: DonatorRank?,
    /**
     * Whether to display the donator rank
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
interface PlayerGuildData {
    /**
     * The UUID of the players guild, if applicable
     */
    uuid: string?,
    /**
     * The name of the players guild, if applicable
     */
    name: string?,
    /**
     * The tag of the players guild, if applicable
     */
    tag: string?,
    /**
     * The players rank in the guild, if applicable
     */
    rank: GuildRank?,
    /**
     * Returns the API object of the guild, if applicable
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
interface PlayerLevelsData {
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
    combined: number,
    /**
     * The combined total level of the player, including deleted classes. This includes the first level of professions
     */
    includingDeleted: number
}

/**
 * A territories general information
 */
interface TerritoryStub {
    /**
     * The name of the territory
     */
    name: string,
    /**
     * The location of the territory
     */
    location: RectangleLocation,
}

/**
 * A discoveries general information
 */
interface DiscoveryStub {
    /**
     * The name of the discovery
     */
    name: string,
    /**
     * The location of the discovery
     */
    location: CuboidLocation,
}

/**
 * An Aspect's tier
 */
interface AspectTier {
    /**
     * The tier's threshold
     */
    threshold: number,
    /**
     * A formatted description of the tier's effects
     */
    description: string,
}

/**
 * An archetype restriction on an ability unlock
 */
interface ArchetypeRequirement {
    /**
     * The archetype to which the threshold applies
     */
    name: string,
    /**
     * The amount of required unlocked abilities in the archetype to unlock this ability
     */
    amount: number
}

/**
 * The location of an ability tree node on the tree
 */
interface AbilityNodeLocation {
    /**
     * The X coordinate of the node, starts counting from 1
     */
    x: number,
    /**
     * The Y coordinate of the node, starts counting from 1
     */
    y: number,
    /**
     * The page on which this node appears
     */
    page: number,
}

/**
 * An ability tree archetype
 */
interface Archetype {
    /**
     * The ID of the archetype
     */
    id: string,
    /**
     * The name of the archetype, includes formatting codes
     */
    name: string,
    /**
     * The description of the archetype, includes formatting codes
     */
    description: string,
    /**
     * The short description of the archetype
     */
    shortDescription: string,
    /**
     * The sprite used for the icon of the archetype
     */
    sprite: Sprite
}

/**
 * The direction a connector can have
 */
type ConnectorDirection =
    | "UP_RIGHT"
    | "UP_DOWN"
    | "UP_LEFT"
    | "RIGHT_DOWN"
    | "RIGHT_LEFT"
    | "DOWN_LEFT"
    | "UP_RIGHT_DOWN"
    | "UP_RIGHT_LEFT"
    | "UP_DOWN_LEFT"
    | "RIGHT_DOWN_LEFT"
    | "UP_RIGHT_DOWN_LEFT";

/**
 * A rank in a guild
 */
type GuildRank =
    | "OWNER"
    | "CHIEF"
    | "STRATEGIST"
    | "CAPTAIN"
    | "RECRUITER"
    | "RECRUIT";

/**
 * A color as used by Minecraft
 */
type MinecraftColor =
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
type BannerPattern =
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
interface BannerLayer {
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
interface BannerData {
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
 * An object with data about a guilds season placement
 */
interface SeasonRank {
    /**
     * The number of the season
     */
    season: number,
    /**
     * The Season Rating (SR) the guild had at the end of the season
     */
    rating: number,
    /**
     * The amount of territories the guild had at the end of the season
     */
    finalTerritories: number
}

/**
 * A guild level in friendly format
 */
interface GuildXPInterpretation {
    /**
     * If this is `false`, all other properties are `null`, should never be `false`, unless the library hasn't updated in years
     */
    isSafe: boolean,
    /**
     * The maximum error the xp values may be off by, divide `xpRaw` by this number in order to get the the lower bound for the xp value
     */
    maxErrorLower: number,
    /**
     * The maximum error the xp values may be off by, multiply `xpRaw` by this number in order to get the upper bound for the xp value
     */
    maxErrorUpper: number,
    /**
     * The progression of the guild towards the next guild level as a number between 0 and 1; rounded to the nearest percent
     */
    xpPct: number,
    /**
     * The approximate raw amount of XP of the guild at this moment, this rounds to the value of the nearest percent
     */
    xpRaw: number,
    /**
     * The total raw amount of XP required for this level
     */
    required: number
}

/**
 * Stats for items,
 * weapon stats are only set on weapons,
 * armor stats are only set on armor
 */
interface ItemStats {
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
interface ItemRequirements {
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
     *     <img src="../../assets/note.png", class="noteBoxIcon">The value here is always the base class.
     * </div>
     */
    class: ClassBaseType?,
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
interface ItemSkin {
    /**
     * The UUID of the player used for the skin
     * <div class="noteBox warning" style="display:flex">
     *     <img src="../../assets/warning.png", class="noteBoxIcon">This field is always null.
     * </div>
     * @deprecated
     */
    uuid: null,
    /**
     * The name of the player used for the skin
     * <div class="noteBox warning" style="display:flex">
     *     <img src="../../assets/warning.png", class="noteBoxIcon">This field is always null.
     * </div>
     * @deprecated
     */
    name: null,
    /**
     * The URL to the player skin
     */
    url: string
}

/**
 * A restriction put on an item
 */
type ItemRestriction =
    | "UNTRADABLE"
    | "QUEST_ITEM"; // "Quest Item"

/**
* A weapon attack speed
*/
type AttackSpeed =
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
type ItemRarity =
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
type ItemDropType =
    | "NEVER"
    | "NORMAL"
    | "DUNGEON"
    | "LOOTCHEST";

/**
 * All weapon, armor, and accessory types
 */
type ItemType =
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
type ItemCategory =
    | "ARMOR"
    | "WEAPON"
    | "ACCESSORY";

/**
 * The identifier for the online players list
 */
type OnlinePlayersIdentifier = "USERNAME" | "UUID";

/**
 * A singular identification
 */
interface Identification {
    /**
     * The name of the identification
     */
    name: string,
    /**
     * The base value for the identification
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon"><div>This is only set on {@link Item | Items}.</div>
     * </div>
     */
    base?: number,
    /**
     * The numerically lowest possible value of the identification's roll
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon"><div>On inverted IDs, this is the best possible roll.</div>
     * </div>
     */
    min: number,
    /**
     * The numerically highest possible value of the identification's roll
     * <div class="noteBox note" style="display:flex">
     *     <img src="../../assets/note.png", class="noteBoxIcon"><div>On inverted IDs, this is the worst possible roll.</div>
     * </div>
     */
    max: number
}

/**
 * An item sprite
 */
interface Sprite {
    /**
     * The type of the sprite
     */
    type: SpriteType,
    /**
     * The string version of the items ID
     */
    id: MinecraftStringId,
    /**
     * The items numerical ID
     */
    numericalId: number,
    /**
     * The items damage value (data value); only present on LEGACY sprite types
     */
    damage?: number,
    /**
     * The items customModelData attribute; only present on ATTRIBUTE sprite types
     */
    customModelData?: number,
    /**
     * The items sprite name, used for requesting an icon from the CDN; only present on ATTRIBUTE sprite types
     */
    name?: string
}

/**
 * The crafting grid position modifiers of an ingredient
 */
interface PositionModifiers {
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
interface RestrictedIdModifiers {
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
type CraftingSkill =
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
type CraftableItemType =
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
 * The type of a sprite, determining what fields are present on the sprite
 */
type SpriteType =
    | "LEGACY"
    | "ATTRIBUTE";

/**
 * A material to be used while crafting an item
 */
interface CraftingMaterial {
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
interface Resources {
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
interface RectangleLocation {
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
 * A cuboid
 */
interface CuboidLocation {
    /**
     * The bounds of the region on the X-axis
     */
    x: Range,
    /**
     * The bounds of the region on the X-axis
     */
    y: Range,
    /**
     * The bounds of the region on the Z-axis
     */
    z: Range
}

/**
 * A URL to a Wynncraft API resource
 */
type WynncraftAPIRoute = `https://api.wynncraft.com/${string}`;
