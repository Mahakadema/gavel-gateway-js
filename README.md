# gavel-gateway-js
An object-oriented Wynncraft API wrapper for Javascript

- Fully Promise based
- Object-oriented
- Flexible and powerful
- 100% coverage of legacy and V2 API
### Usage
1. Install the package `npm i gavel-gateway-js`
2. Require the dependency in your project
```js
const wynnAPI = require('gavel-gateway-js');
```
3. Request any resource
```js
let salted = await wynnAPI.fetchPlayer("Salted").catch(console.log);

wynnAPI.fetchPlayer({
    player: "Salted",
    allowCache: false
})
.then(player => console.log(player.classes[0].quests))
.catch(console.log);

let recipes = await wynnAPI.fetchRecipes({
    type: "BOOTS",
    level: {
        min: 40,
        max: 75
    }
}).catch(console.log);
```
### Versioning
gavel-gateway-js uses semantic versioning for the library API. This means that any breaking changes to the endpoint functions and utils of the library result in a major version push. Feature additions will result in a minor version push and bugfixes will push the patch version.
However, as the Wynncraft API may introduce breaking changes without notice (and has repeatedly done so) the API Objects returned by the endpoint functions are not deemed to be part of the gavel-gateway-js API. This means that breaking changes may be introduced to objects such as `Player` or `Item` without a major version push. To give developers the tools to handle breaking changes to API Objects, all API Objects include two properties `apiVersion` and `libVersion`. `libVersion` updating the major version or `apiVersion` updating any version number will likely introduce breaking changes to the specific model.
### How To Contribute
Anybody is welcome to contribute to gavel-gateway-js.
To make a contribution, fork the project, commit your changes and additions, run them agains the tests, and open a Pull Request on this repository.
We will check the changes and request alterations if needed. If we deem the Pull Request to be helpful to the project, it will be merged.
Please make sure to open Pull Requests **only on the `development` branch** of the repository.
