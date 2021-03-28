const Card = require('../../Card.js');

class RapidEvolution extends Card {
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
