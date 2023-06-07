const _ = require('underscore');
const Card = require('../../Card.js');

class CatchAndRelease extends Card {
    // Play: Return each creature to its owner`s hand. Each player
    // discards random cards from their hand until they have 6 or
    // fewer cards in hand. Gain 2 chains.
    setupCardAbilities(ability) {
        this.play({
            effect: "return all creatures to their owner's hand",
            gameAction: [
                ability.actions.returnToHand((context) => ({
                    target: context.game.creaturesInPlay
                })),
                ability.actions.gainChains({ amount: 2 })
            ],
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.sequential([
                    ability.actions.conditional({
                        condition: (context) => context.player.hand.length > 6,
                        trueGameAction: ability.actions.discard((context) => ({
                            target: _.shuffle(context.player.hand)[0]
                        }))
                    }),
                    ability.actions.conditional({
                        condition: (context) =>
                            !!context.player.opponent && context.player.opponent.hand.length > 6,
                        trueGameAction: ability.actions.discard((context) => ({
                            target: _.shuffle(context.player.opponent.hand)[0]
                        }))
                    })
                ]),
                then: (preThenContext) => ({
                    alwaysTriggers: true,
                    gameAction: ability.actions.conditional({
                        condition: (context) =>
                            context.player.hand.length > 6 ||
                            (!!context.player.opponent && context.player.opponent.hand.length > 6),
                        trueGameAction: ability.actions.resolveAbility({
                            ability: preThenContext.ability
                        })
                    })
                })
            }
        });
    }
}

CatchAndRelease.id = 'catch-and-release';

module.exports = CatchAndRelease;
