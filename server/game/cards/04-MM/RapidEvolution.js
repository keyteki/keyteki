const Card = require('../../Card.js');

class RapidEvolution extends Card {
    // Play: Choose a creature. Give it a +1 power counter for each A you have.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.addPowerCounter((context) => ({
                    amount: context.player.amber
                }))
            }
        });
    }
}

RapidEvolution.id = 'rapid-evolution';

module.exports = RapidEvolution;
