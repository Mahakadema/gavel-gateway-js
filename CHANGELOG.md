# v3.2.0

## Model Changes
- added `passiveIconUrl` and `activeIconUrl` to Ability and AbilityConnectorNode.
- Ability sprites are now of type ATTRIBUTE
- Archetype sprites are now of type ATTRIBUTE
    - This bumps the major version on PlayerCharacterAbilityTree and AbilityTree
- Most Item sprites are now of type ATTRIBUTE
    - This bumps the Item major version

## Additions
- Added fetchAspects(), along with the Aspect class
- Added `type` to Sprite
- SpriteQuery's now also accept `customModelData` and `name`, allowing search for ATTRIBUTE type Sprites

## Bugfixes
- switched to beta-api.wynncraft.com temporarily.
    - Due to the beta-api closing eventually, the package needs to be updated soon after the main api works again.
- fixed rank colors in MultipleChoicesErrors
- fixed veteran in MultipleChoicesErrors
- fixed MultipleChoicesErrors sometimes failing due to missing player ranks

v3.2.1

## Model Changes
- Added `territories` and `discoveries` to NameSearch

## Bugfixes
- Fixed NameSearch failing to parse Items properly
