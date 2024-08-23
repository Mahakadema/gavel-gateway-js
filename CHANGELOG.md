# v3.1.4

## Model Changes
- added `passiveIconUrl` and `activeIconUrl` to Ability and AbilityConnectorNode.
- Ability sprites are now of type ATTRIBUTE
- Archetype sprites are now of type ATTRIBUTE
- Most Item sprites are now of type ATTRIBUTE

## Additions
- Added fetchAspects(), along with the Aspect class
- Added `type` to Sprite
- SpriteQuery's now also accept `customModelData` and `name`, allowing search for ATTRIBUTE type Sprites

## Bugfixes
- switched to beta-api.wynncraft.com temporarily. This is to keep data updated
- fixed rank colors in MultipleChoicesErrors
- fixed veteran in MultipleChoicesErrors
- fixed MultipleChoicesErrors sometimes failing due to missing player ranks
