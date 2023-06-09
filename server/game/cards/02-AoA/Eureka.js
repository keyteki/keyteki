const Card = require('../../Card.js');

class Eureka extends Card {
    // Alpha.
    // Play: Gain 2A. Archive 2random cards from your hand.
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.gainAmber((context) => ({ amount: 2, target: context.player })),
                ability.actions.archiveAtRandom((context) => ({
                    target: context.player,
                    amount: 2
                }))
            ]
        });
    }
}

Eureka.id = 'eureka';

module.exports = Eureka;
