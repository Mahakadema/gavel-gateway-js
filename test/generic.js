
const api = require("../lib/src/index.js");

/**
 * This file is excluded from package downloads
 * as it stores private data. Its' template is:
 * [
 *     "<API Key 1>",
 *     "<API Key 2>",
 *     ...
 * ]
 */
const apiKeys = require("../testApiKeys.json");

api.setConfig({ apiKeys: apiKeys });

async function main() {
    console.log(`Starting test`);
    const startTime = Date.now();

    const guildsToTest = [
        {
            guild: "Cyphrus Code",
            cacheFor: 40000
        },
        {
            guild: "TheNoLifes"
        },
        "Nobody",
        "Illegal Name     ",
        {
            guild: "Cyphrus Code",
            retries: 0
        },
        ""
    ];
    const playersToTest = [
        "asdbsdloafh",
        {
            player: "Nightstriker",
            forceCaseMatch: true
        },
        {
            player: "NightStriker",
            forceCaseMatch: true
        },
        "NightStriker",
        "Woodcreature",
        {
            player: "NOTGDATALL",
            forceUUIDLookup: true
        },
        {
            player: "Heyzeer0",
            timeout: 3000
        }
    ];
    const recipesToTest = [
        {
            id: "boots-3"
        },
        {
            level: {
                min: 11,
                max: 20
            }
        },
        {
            level: {
                min: 4,
                max: 35
            },
            skill: "WOODWORKING"
        },
        {
            type: "BOW"
        },
        {
            durability: {
                min: 500,
                max: 550
            }
        },
        {
            durability: {
                min: 50,
                max: 200
            },
            duration: {
                min: 10,
                max: 100
            }
        },
        {
            basicDuration: {
                min: 60,
                max: 60
            },
            level: {
                min: 1,
                max: 30
            }
        },
        {
            health: {
                min: 10,
                max: 20
            },
            damage: {
                min: 10,
                max: 20
            }
        },
        {
            health: {
                min: 400,
                max: 1000
            }
        }
    ];
    const itemsToTest = [
        "TOXOPLASMOSis",
        {
            name: "Spirit",
            identifications: {
                manaRegen: {},
            }
        },
        {
            majorIds: {
                requireAll: false,
                list: [
                    "RALLY",
                    "HEART_OF_THE_PACK"
                ]
            }
        },
        {
            stats: {
                fireDamage: {
                    min: 150,
                    max: 200
                }
            }
        },
        {
            stats: {
                thunderDefence: {
                    min: 150,
                    max: 200
                }
            }
        },
        {
            requirements: {
                agility: {
                    min: 70,
                    max: 80
                }
            }
        },
        {
            lore: "anciEnt"
        },
        {
            dropType: "DUngeon",
        },
        {
            sprite: "minecraft:wooden_shovel",
            requirements: {
                level: {
                    min: 90
                }
            }
        },
        {
            sprite: {
                id: 269,
                damage: 14
            }
        },
        {
            category: "acCESSORy",
            restriction: "UNTRADABLE",
            tier: "UNIQUE"
        },
        {
            type: "HELMET",
            tier: "SET"
        },
        {
            tier: "FABLED"
        },
        {
            restriction: null,
            name: "be"
        }
    ];

    /**
     * @type {import("../lib/src/index.js").IngredientSearchRequestOptions[]}
     */
    const ingredientsToTest = [
        {
            name: "Ancient"
        },
        "YotTa",
        {
            tier: 3,
            level: {
                min: 90,
                max: 110
            }
        },
        {
            skills: {
                requireAll: false,
                list: [
                    "SCRIBING",
                    "COOKING"
                ]
            },
            sprite: "minecraft:potato"
        },
        {
            sprite: {
                id: "minecraft:flint_and_steel",
                damage: 1
            }
        },
        {
            identifications: {
                manaRegen: {}
            }
        },
        {
            restrictedIds: {
                requireAll: true,

                charges: {
                    min: 1
                },
                duration: {
                    min: 1
                }
            }
        },
        {
            positionModifiers: {
                left: {
                    min: 10
                }
            }
        },
        {
            tier: -1
        }
    ]

    console.log(`
#####################################
Requesting invalid player stats route
#####################################
`);

    const invalidPlayerRoute = "https://api.wynncraft.com/v2/player/Carrie/stat";
    console.log(invalidPlayerRoute);
    await api.fetchRaw({
        route: invalidPlayerRoute
    }).then(console.log).catch(console.log);

    console.log(`
#####################################
Requesting players
#####################################
`);

    for (const player of playersToTest) {
        console.log("Requesting", player);
        const start = Date.now();
        try {
            const result = await api.fetchPlayer(player);
            console.log(Date.now() - start, "ms");
            console.log(result.name);
            console.log(result.totalLevel);
            console.log(result.source);
        } catch (e) {
            console.log(e);
        }
        console.log();
    }

    console.log(`
#####################################
Requesting UUIDs
#####################################
`);

    await api.fetchPlayerUUID("Carrie").then(console.log);
    await api.fetchPlayerUUID("carrie").then(console.log);

    console.log(`
#####################################
Requesting guilds
#####################################
`);

    await api.fetchGuild({ guild: "Nerfuria", fetchAdditionalStats: true }).then(console.log);

    for (const guild of guildsToTest) {
        console.log("Requesting", guild);
        const start = Date.now();
        const result = await api.fetchGuild(guild).catch(e => e);
        console.log(Date.now() - start, "ms")
        if (result?.tag) {
            console.log(result?.name);
            console.log(result?.members.length);
        } else {
            console.log(result);
        }
        console.log();
    }

    console.log(`
#####################################
Requesting .fetch() functions
#####################################
`);

    const ern = await api.fetchGuild("Emorians");
    const lee = await ern.members[0].fetch();
    console.log(lee.name, lee.uuid);
    const ern2 = await lee.guild.fetch(); // draws from cache so no delay
    console.log(ern2.name, ern2.territories);
    console.log();

    console.log(`
#####################################
Requesting territoryList
#####################################
`);

    const terrsStart = Date.now();
    const terrs = await api.fetchTerritoryList().catch(e => e);
    if (terrs.list) {
        console.log(Date.now() - terrsStart, "ms")
        console.log(terrs.list.slice(10, 13));
        console.log(terrs.list[0])
    } else {
        console.log(terrs);
    }

    console.log(`
#####################################
Requesting Recipes
#####################################
`);

    await api.fetchRecipes("BOoTS-13-15").then(v => console.log(v.list)).catch(console.log);

    for (const request of recipesToTest) {
        console.log("Requesting", request);
        const start = Date.now();
        const result = await api.fetchRecipes(request).catch(e => e);
        console.log(Date.now() - start, "ms")
        if (result.list) {
            console.log(result.list.map(v => v.id).join(", "));
        } else {
            console.log(result);
        }
        console.log();
    }

    console.log(`
#####################################
Requesting Leaderboards
#####################################
`);

    await api.fetchGuildLeaderboard().then(v => console.log(v.list.slice(0, 3)));
    await api.fetchPlayerLeaderboard("PVP").then(v => console.log(v.list.slice(0, 3)));
    await api.fetchPlayerLeaderboard({ type: "COMBAT" }).then(v => console.log(v.list.slice(0, 3)));
    await api.fetchPlayerLeaderboard({ type: "COOKING" }).catch(console.log);
    await api.fetchPlayerLeaderboard({ scope: "SOLO", type: "COOKING" }).then(v => console.log(v.list.slice(0, 3)));

    console.log(`
#####################################
Requesting Items
#####################################
`);

    const itemStart = Date.now();
    const item = await api.fetchItems("Mask of Enlightenme");
    console.log(Date.now() - itemStart, "ms");
    console.log(item?.list[0] ?? item);

    for (const request of itemsToTest) {
        console.log("Requesting", request);
        const start = Date.now();
        const result = await api.fetchItems(request).catch(e => e);
        console.log(Date.now() - start, "ms")
        if (result.list) {
            console.log(result.list.map(v => v.name).join(", "));
        } else {
            console.log(result);
        }
        console.log();
    }

    console.log(`
#####################################
Requesting Ingredients
#####################################
`);

    const ingredientStart = Date.now();
    const ingredient = await api.fetchIngredients("yottaBYTE");
    console.log(Date.now() - ingredientStart, "ms");
    console.log(ingredient?.list[0] ?? ingredient);

    for (const request of ingredientsToTest) {
        console.log("Requesting", request);
        const start = Date.now();
        const result = await api.fetchIngredients(request).catch(e => console.log(e));
        console.log(Date.now() - start, "ms")
        if (result?.list) {
            console.log(result.list.map(v => v.name).join(", "));
        }
        console.log();
    }

    console.log(`
#####################################
Testing Guild List
#####################################
`);

    const guildList = await api.fetchGuildList();
    console.log(guildList.list.length, guildList.list.slice(guildList.list.length - 10));

    console.log(`
#####################################
Testing Ingredient List
#####################################
`);

    const ingredientList = await api.fetchIngredientList();
    console.log(ingredientList.list.length, ingredientList.list.slice(ingredientList.list.length - 10));

    console.log(`
#####################################
Testing Recipe List
#####################################
`);

    const recipeList = await api.fetchRecipeList();
    console.log(recipeList.list.length, recipeList.list.slice(recipeList.list.length - 10));

    console.log(`
#####################################
Testing Online Players
#####################################
`);

    const onlinePlayers = await api.fetchOnlinePlayers();
    console.log(onlinePlayers.list.map(v => `${v.name} ${v.worldType} ${v.players.length}`).join("\n"));

    console.log(`
#####################################
Testing Online Player Sum
#####################################
`);

    const onlinePlayersSum = await api.fetchOnlinePlayersSum();
    console.log(onlinePlayersSum);

    console.log(`
#####################################
Testing Name Search
#####################################
`);

    const names = await api.fetchNames("Palad");
    console.log(names);

    console.log(`
#####################################
Testing Map Locations
#####################################
`);

    const mapLocations = await api.fetchMapLocations();
    console.log(mapLocations.list.slice(-10));

    console.log(`
#####################################
Testing Self Location
#####################################
`);

    const party = await api.fetchMyLocation();
    console.log(party);
    if (party) {
        const self = await party.self.fetch();
        console.log(self.name, self.mobsKilled);
    }

    console.log(`
#####################################
Testing config functionality
#####################################
`);

    try {
        api.setConfig({
            defaultRetries: 2
        });
        console.log(api.setConfig({}));
        api.setConfig({
            defaultTimeout: "10000"
        });
    } catch (e) {
        console.log(e);
    }
    console.log();

    console.log(`
#####################################
Local Data
#####################################
`);

    console.log(api.data.majorIds);
    api.data.sprites.get("BOW_DEFAULT_0").id = "We do a little tactical ignorance towards code conventions";
    console.log(api.data.sprites.get("BOW_DEFAULT_0"));
    console.log((await api.fetchItems("Impeccable Oak Bow")).list.map(v => v.sprite));

    console.log(
        "#####################################\n" +
        "Identification Data\n" +
        "#####################################"
    );
    const items = await api.fetchRaw(api.setConfig({}).routes.ITEMS.url);
    const itemsSet = new Set();
    console.log("---item properties---");
    for (const item of items.items) {
        for (const prop in item) {
            if (!itemsSet.has(prop)) {
                if (!api.data.identifications.find(v => v.itemApiName === prop)) // disable this line to show all props, not just unknown ones
                    console.log(prop.padEnd(40), item.name, item[prop]);
                itemsSet.add(prop);
            }
        }
    }
    console.log();
    console.log("---unused item IDs---");
    console.log(api.data.identifications.filter(v => !itemsSet.has(v.itemApiName)).map(v => v.name).join("\n"));

    const ingredients = await api.fetchRaw(api.setConfig({}).routes.INGREDIENT_SEARCH.url);
    console.log();
    itemsSet.clear();
    console.log("---ingredient IDs---");
    for (const ingredient of ingredients.data) {
        for (const prop in ingredient.identifications) {
            if (!itemsSet.has(prop)) {
                if (!api.data.identifications.find(v => v.ingredientApiName === prop)) // disable this line to show all props, not just unknown ones
                    console.log(prop.padEnd(40), ingredient.name, ingredient.identifications[prop]);
                itemsSet.add(prop);
            }
        }
    }
    console.log();
    console.log("---unused item IDs---");
    console.log(api.data.identifications.filter(v => !itemsSet.has(v.ingredientApiName)).map(v => v.name).join("\n"));
    console.log();
    itemsSet.clear();
    console.log("---ingredient itemOnly IDs---");
    for (const ingredient of ingredients.data) {
        for (const prop in ingredient.itemOnlyIDs) {
            if (!itemsSet.has(prop)) {
                console.log(prop.padEnd(40), ingredient.name, ingredient.itemOnlyIDs[prop]);
                itemsSet.add(prop);
            }
        }
    }
    console.log();
    itemsSet.clear();
    console.log("---ingredient consumableOnly IDs---");
    for (const ingredient of ingredients.data) {
        for (const prop in ingredient.consumableOnlyIDs) {
            if (!itemsSet.has(prop)) {
                console.log(prop.padEnd(40), ingredient.name, ingredient.consumableOnlyIDs[prop]);
                itemsSet.add(prop);
            }
        }
    }

    console.log(
        "#####################################\n" +
        "Map Location stuff\n" +
        "#####################################"
    );
    console.log('    | "' + (await api.fetchMapLocations()).list.map(v => v.icon).sort().filter((v, i, a) => v !== a[i - 1]).join('"\n    | "') + '"')
    console.log();
    console.log("-----------");
    console.log();
    console.log('    | "' + (await api.fetchMapLocations()).list
        .sort((a, b) => a.name < b.name ? -1 : b.name > a.name)
        .filter((v, i, a) => v.name !== a[i - 1]?.name)
        .sort((a, b) => {
            const categories = [
                (l) => l.name.endsWith("Dungeon"),
                (l) => l.icon === "Content_Quest.png",
                (l) => l.name.includes("Mini-Quest"),
                (l) => ["Content_UltimateDiscovery.png", "Content_GrindSpot.png", "Content_Cave.png", "Content_BossAltar.png", "Content_Raid.png"].includes(l.icon) || l.icon.startsWith("Special_") || l.name === "Corrupted Dungeons",
                (l) => l.icon.startsWith("NPC_"),
                (l) => l.name.endsWith("Merchant"),
                (l) => l.name.endsWith("Station")
            ];
            const aIdx = categories.findIndex(v => v(a));
            const bIdx = categories.findIndex(v => v(b));
            if (aIdx === bIdx)
                return a.name < b.name ? -1 : b.name > a.name;
            return aIdx - bIdx;
        })
        .map(v => v.name)
        .join('"\n    | "') + '"')

    console.log(`
#####################################
Ratelimit after all tests completed
#####################################
`);

    console.log(api.ratelimit());
    console.log(`Finished test, took ${Date.now() - startTime} ms`);
}
main();
