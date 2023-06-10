const Card = require('../../Card.js');

class Begone extends Card {
    // Play: Choose one: destroy each Dis creature, or gain 1A.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'select',
                choices: {
                    'Destroy each Dis creature': ability.actions.destroy((context) => ({
                        target: context.game.creaturesInPlay.filter((card) => card.hasHouse('dis'))
                    })),
                    'Gain 1 amber': ability.actions.gainAmber()
                }
            }
        });
    }
}

Begone.id = 'begone';

module.exports = Begone;
