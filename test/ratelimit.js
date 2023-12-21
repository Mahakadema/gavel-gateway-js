
const ggjs = require("..");

ggjs.setConfig({
    allowCacheByDefault: false,
    apiKeys: [{
        interval: 60000,
        key: "",
        limit: 1000
    }]
});

// async function main() {
//     console.log(ggjs.ratelimit());

//     const testStart = Date.now();
//     for (let i = 0; Date.now() - testStart < 120_000; i++) {
//         const promise = sleep(100); // not awaited here, yet
//         await ggjs.fetchOnlinePlayers({ allowCache: false }).then(res => {
//             console.log(new Date(), ggjs.ratelimit().channels.find(v => v.total === 3000).remaining, res.timestamp, res.list.length, Date.now() - res.requestedAt);
//             // if (!(res.list.length > 30))
//             //     throw res;
//         }).catch(e => {
//             console.log(new Date(), ggjs.ratelimit().channels.find(v => v.total === 3000).remaining, e);
//             // throw e;
//         });
//         await promise;
//     }

//     function sleep(ms) {
//         return new Promise(res => setTimeout(res, ms));
//     }

//     console.log(ggjs.ratelimit());
// }

async function main() {
    console.log(ggjs.ratelimit());

    // await ggjs.fetchRaw({ route: "https://api.wynncraft.com/v3/leaderboards/types", allowCache: false })
    for (let i = 0; i < 186; i++) {
        const res = await ggjs.fetchRawNew({ route: "https://api.wynncraft.com/v3/leaderboards/types", allowCache: false });
        console.log(res.headers["date"], res.status, i);
        if (res.status !== 200)
            console.log(res);
    }


    console.log(ggjs.ratelimit());
}

main();

