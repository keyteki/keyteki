const Card = require('../../Card.js');

class MarsAmbassador extends Card {
    setupCardAbilities(ability) {
        this.reap({
            fight: true,
            effect: 'allow them to play or use one Mars card this turn',
            target: {
                mode: 'select',
                choices: {
                    'Use a Mars Card': ability.actions.use({
                        promptForSelect: {
                            location: 'play area',
                            controller: 'self',
                            cardCondition: card => card.hasHouse('mars')
                        }
                    }),
                    'Play a Mars Card': ability.actions.playCard({
                        promptForSelect: {
                            location: 'hand',
                            controller: 'self',
                            cardCondition: card => card.hasHouse('mars')
                        }
                    })
                }
            }
        });
    }
}

MarsAmbassador.id = 'mars-ambassador';

module.exports = MarsAmbassador;
