const Card = require('../../Card.js');

class SoulLock extends Card {
    // Your opponent cannot use cards that match the house of any faceup card under Soul Lock.
    // Action: Discard all cards under Soul Lock. Put an enemy creature faceup under Soul Lock.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.playerCannot('use', (context, effectContext, event) => {
                if (
                    !effectContext.source.childCards ||
                    effectContext.source.childCards.length === 0
                ) {
                    return false;
                }
                const source =
                    event && event.card
                        ? event.card
                        : context.target
                        ? context.target
                        : context.source;
                return effectContext.source.childCards.some((child) =>
                    child.getHouses().some((house) => source.hasHouse(house))
                );
            })
        });

        this.action({
            gameAction: ability.actions.discard((context) => ({
                target: context.source.childCards
            })),
            then: {
                alwaysTriggers: true,
                target: {
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.placeUnder((context) => ({
                        parent: context.source
                    }))
                },
                message:
                    '{0} uses {1} to place under {2} and prevent {3} from using cards of the same house',
                messageArgs: (context) => [
                    context.player,
                    context.source,
                    context.target,
                    context.player.opponent
                ],
                effectAlert: true
            }
        });
    }
}

SoulLock.id = 'soul-lock';

module.exports = SoulLock;
