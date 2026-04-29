const Card = require('../../Card.js');

class TrashHeap extends Card {
    // Play: Destroy each creature. Each player reveals their hand and
    // discards each creature revealed this way. Each player refills their
    // hand as if it were their "draw cards" step.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.sequential([
                ability.actions.destroy((context) => ({
                    target: context.game.creaturesInPlay
                })),
                ability.actions.reveal((context) => ({
                    target: context.player.hand,
                    chatMessage: true
                })),
                ability.actions.reveal((context) => ({
                    target: context.player.opponent ? context.player.opponent.hand : [],
                    chatMessage: true
                })),
                ability.actions.discard((context) => ({
                    target: context.player.hand.filter((card) => card.type === 'creature')
                })),
                ability.actions.discard((context) => ({
                    target: context.player.opponent
                        ? context.player.opponent.hand.filter((card) => card.type === 'creature')
                        : []
                }))
            ]),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.draw((context) => ({
                    target: context.game.getPlayers(),
                    refill: true
                })),
                message: '{0} uses {1} to have each player refill their hand'
            }
        });
    }
}

TrashHeap.id = 'trash-heap';

module.exports = TrashHeap;
