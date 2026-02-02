const Card = require('../../Card.js');

class Ostracize extends Card {
    // Play: Lose 1A. If you do, purge a creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.loseAmber((context) => ({
                target: context.player
            })),
            then: {
                message: '{0} uses {1} to purge {2}',
                target: {
                    cardType: 'creature',
                    gameAction: ability.actions.purge()
                }
            }
        });
    }
}

Ostracize.id = 'ostracize';

module.exports = Ostracize;
