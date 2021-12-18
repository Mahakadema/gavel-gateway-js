# gavel-gateway-js
An object-oriented Wynncraft API wrapper for Javascript

- Fully Promise based
- Object-oriented
- Flexible and powerful
- 100% coverage of legacy and V2 API
### Usage
1. Install the package `npm i gavel-gateway-js`
1. Require the dependency in your project
```js
const wynnAPI = require('gavel-gateway-js');
```
1. Request any resource
```js
let salted = await wynnAPI.fetchPlayer("Salted").catch(console.log);

let saltedWithOptions = wynnAPI.fetchPlayer({
    name: "Salted",
    allowCache: false
})
.then(player => console.log(player.classes[0].quests))
.catch(console.log);

let recipes = await wynnAPI.searchRecipes({
    type: "BOOTS",
    level: {
        min: 40,
        max: 75
    }
}).catch(console.log);
```
### How To Contribute
Anybody is welcome to contribute to gavel-gateway-js.
To make a contribution, fork the project, commit your changes and additions, run them agains the tests, and open a Pull Request on this repository.
We will check the changes and request alterations if needed. If we deem the Pull Request to be helpful to the project, it will be merged.
Please make sure to open Pull Requests **only on the development branch** of the repository.
