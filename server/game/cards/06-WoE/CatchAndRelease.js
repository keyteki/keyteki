const _ = require('underscore');
const Card = require('../../Card.js');

class CatchAndRelease extends Card {
    // Play: Return each creature to its owner`s hand. Each player
    // discards random cards from their hand until they have 6 or
    // fewer cards in hand. Gain 2 chains.
    setupCardAbilities(ability) {
        this.play({
            effect:
                "return all creatures to their owner's hand and have eac player discard down to 6 cards",
            gameAction: [
                ability.actions.returnToHand((context) => ({
                    target: context.game.creaturesInPlay
                })),
                ability.actions.gainChains({ amount: 2 })
            ],
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.sequential([
                    ability.actions.discard((context) => ({
                        target:
                            context.player.hand.length > 6
                                ? _.shuffle(context.player.hand).slice(6)
                                : []
                    })),
                    ability.actions.discard((context) => ({
                        target:
                            !!context.player.opponent && context.player.opponent.hand.length > 6
                                ? _.shuffle(context.player.opponent.hand).slice(6)
                                : []
                    }))
                ])
            }
        });
    }
}

CatchAndRelease.id = 'catch-and-release';

module.exports = CatchAndRelease;
