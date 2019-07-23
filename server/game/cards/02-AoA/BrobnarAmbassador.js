const Card = require('../../Card.js');

class BrobnarAmbassador extends Card {
    setupCardAbilities(ability) {
        this.reap({
            fight: true,
            effect: 'allow them to play or use one Brobnar card this turn',
            target: {
                mode: 'select',
                choices: {
                    'Use a Brobnar Card': ability.actions.use({
                        promptForSelect: {
                            location: 'play area',
                            controller: 'self',
                            cardCondition: card => card.hasHouse('brobnar')
                        }
                    }),
                    'Play a Brobnar Card': ability.actions.playCard({
                        promptForSelect: {
                            location: 'hand',
                            controller: 'self',
                            cardCondition: card => card.hasHouse('brobnar')
                        }
                    })
                }
            }
        });
    }
}

BrobnarAmbassador.id = 'brobnar-ambassador';

module.exports = BrobnarAmbassador;
