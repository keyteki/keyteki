const Card = require('../../Card.js');

class BlatantThievery extends Card {
    // Play: Enrage an enemy creature. Move all A from that creature to your pool.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.enrage()
            },
            effect: 'enrage {1} and move all {2} amber from {1} to their pool',
            effectArgs: (context) => [context.target, context.target.amber],
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.removeAmber((context) => ({
                    target: context.preThenEvent ? context.preThenEvent.card : null,
                    all: true
                })),
                then: {
                    gameAction: ability.actions.gainAmber((context) => ({
                        amount: context.preThenEvent.amount
                    }))
                }
            }
        });
    }
}

BlatantThievery.id = 'blatant-thievery';

module.exports = BlatantThievery;
