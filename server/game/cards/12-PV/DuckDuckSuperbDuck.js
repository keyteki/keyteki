const Card = require('../../Card.js');

class DuckDuckSuperbDuck extends Card {
    // Play: Choose one:
    // Archive 2 random cards.
    // Gain 2.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'select',
                choices: {
                    'Archive 2 random cards': ability.actions.archiveAtRandom((context) => ({
                        target: context.player,
                        amount: 2
                    })),
                    'Gain 2': ability.actions.gainAmber({ amount: 2 })
                }
            }
        });
    }
}

DuckDuckSuperbDuck.id = 'duck-duck-superb-duck';

module.exports = DuckDuckSuperbDuck;
