
const ggjs = require("..");
const https = require("https");

// executes a HTTPS request
function getRequest(url, payload) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, { headers: [] });
        // req.end(payload);

        req.on("error", e => { // kill on error
            try {
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
                reject(new Error("No Response received"));
                return;
            } catch (e) {
                reject(e);
                return;
            }
        });
        req.on("response", res => { // fired on initial server response, sets up response processing
            try {
                let text = "";

                res.on("data", chunk => {
                    text += chunk;
                });

                res.on("end", () => { // on finished response, stream closes after this
                    try {
                        if (res.headers["content-type"] !== "application/json" && !res.headers["content-type"]?.startsWith("application/json;")) {
                            console.log("Invalid content type:", res.headers["content-type"])
                            // replace the HTML body with a JSON payload
                            text = JSON.stringify({
                                error: `${res.statusCode} ${res.statusMessage} ${JSON.stringify(text)}`,
                            });
                        }
                        // const result = {
                        //     status: res.statusCode,
                        //     headers: res.headers,
                        //     body: text,
                        //     requestTimestamp: startTime,
                        //     responseTimestamp: Number.isNaN(Date.parse(res.headers["date"])) ? Date.now() : Date.parse(res.headers["date"])
                        // };
                        // resolve(result);
                        resolve(JSON.parse(text));
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
    });
}

function sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
}

let activeReqCount = 0;
async function getUUID(name) {
    if (nameToUUID[name] !== undefined)
        return nameToUUID[name];
    // while (activeReqCount >= 50)
    //     await sleep(10);
    // activeReqCount++;
    // const response = await getRequest(`https://playerdb.co/api/player/minecraft/${name}`, {  });
    // activeReqCount--;
    // try {
    //     nameToUUID[name] = response.data.player.id;
    // } catch(e) {
    //     console.log(response, name);
    // }
    const response = await ggjs.fetchRawNew("https://api.wynncraft.com/v3/player/" + name);
    if (response) {
        nameToUUID[name] = response.body.uuid;
    } else {
        nameToUUID[name] = response;
    }
    return nameToUUID[name];
}

function isNameCached(name) {
    return nameToUUID[name] !== undefined;
}

function sctocc(str) {
    return str.split("").flatMap((v, i, a) => v === "_" && /[a-z\d]/.test(a[i + 1] ?? "") ? [] : a[i - 1] === "_" ? [v.toUpperCase()] : [v]).join("");
}

const nameToUUID = {};

ggjs.setConfig({
    allowCacheByDefault: false,
    maxQueueLength: 2000
});

async function main() {
    // const v1 = await ggjs.fetchRawNew({ route: "https://api.wynncraft.com/public_api.php?acion=onlinePlayers", allowCache: false });
    const [v3names, v3uuids] = await Promise.all([
        ggjs.fetchRawNew({ route: "https://api.wynncraft.com/v3/player", allowCache: false }),
        ggjs.fetchRawNew({ route: "https://api.wynncraft.com/v3/player?identifier=uuid", allowCache: false })
    ]);
    const v3nameEntries = Object.entries(v3names.body.players);
    const v3uuidEntries = Object.entries(v3uuids.body.players);
    const v3uuidMarks = [];
    const uuidsMore = [];
    // const name10Groups = Array.from({ length: Math.ceil(v3nameEntries.length / 10) }, (_, i) => v3nameEntries.slice(10 * i, 10 * (i + 1)).map(v => v[0]));
    const oddNames = [];
    (await Promise.all(v3nameEntries.map(async (v, i) => {
        const uuid = await getUUID(v[0]);
        if (uuid)
            v3uuidMarks.push([uuid, false]);
        return [v[1], v3uuids.body.players[uuid], uuid, v[0]];
    }))).filter(v => !v[0] || !v[1] || !v[2] || !v[3] || v[0] !== v[1]).forEach(v => {
        oddNames.push({ name: v[3], uuid: v[2], uuidWorld: v[1], nameWorld: v[0] });
        console.log(...[`${v[0]}`.padEnd(10), `${v[1]}`.padEnd(10), v[2], v[3]]);
    });
    (await Promise.all(v3uuidEntries
        .filter(v => {
            const match = v3uuidMarks.find(mark => mark[0] === v[0]);
            if (match) {
                if (match[1])
                    console.log("Already accounted for", match);
                match[1] = true;
            }
            return !match;
        })
        .map(pair => ggjs.fetchPlayer(pair[0]).then(v => [v, pair[0], pair[1]]))
    )).forEach(v => {
        const cc = sctocc(v[0].name);
        const match = oddNames.find(v => v.name === cc);
        if (match) {
            console.log("CASE FAULT", v[0].name, match.name, v[2], match.nameWorld);
        // } else if (!isNameCached(v[0].name)) {
        } else {
            uuidsMore.push([v[0].uuid, v[0].name, v[2]]);
        }
    });
    for (const [uuid, name, world] of uuidsMore) {
        console.log("UUID MORE", uuid, name, world);
    }
    for (const [uuid, _] of v3uuidMarks.filter(v => !v[1])) {
        console.log("UUID LESS", uuid);
    }
    for (const odd of oddNames.filter(v => !v.nameWorld)) {
        console.log("NULL WORLD", odd.uuid, odd.name, odd.uuidWorld, odd.nameWorld)
    }
    console.log(v3names.body.total, v3nameEntries.length, v3uuids.body.total, v3uuidEntries.length)

    // setTimeout(main, 30_000);
}

// let lastV3Over = [];
// let lastV1Over = [];

// async function main() {
//     const [v1, v3] = await Promise.all([
//         ggjs.fetchRawNew({ route: "https://api.wynncraft.com/public_api.php?action=onlinePlayers", allowCache: false }),
//         ggjs.fetchRawNew({ route: "https://api.wynncraft.com/v3/player", allowCache: false }),
//         // ggjs.fetchRawNew({ route: "https://api.wynncraft.com/v3/player?identifier=uuid", allowCache: false })
//     ]);
//     const v1Entries = Object.getOwnPropertyNames(v1.body).filter(v => v !== "request").flatMap(v => v1.body[v].map(name => [name, v]));
//     const v3Entries = Object.entries(v3.body.players);
//     const v1Over = [];
//     const v3Over = [];
//     for (const [name, world] of v3Entries.filter(v3 => !v1Entries.find(v1 => v3[0] === sctocc(v1[0])))) {
//         console.log("+V3", name, world);
//         v1Over.push([name, world]);
//     }
//     for (const [name, world] of v1Entries.filter(v1 => !v3Entries.find(v3 => v3[0] === sctocc(v1[0])))) {
//         console.log("+V1", name, world);
//         v3Over.push([name, world]);
//     }
//     const v1Intersection = v1Over.filter(c => lastV1Over.find(p => p[0] === c[0]));
//     const v3Intersection = v3Over.filter(c => lastV3Over.find(p => p[0] === c[0]));
//     console.log("v1\n", )

//     // setTimeout(main, 20_000);
// }

main();
// setInterval(main, 30_000);

