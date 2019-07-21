const Card = require('../../Card.js');

class LogosAmbassador extends Card {
    setupCardAbilities(ability) {
        this.reap({
            fight: true,
            effect: 'allow them to play or use one Logos card this turn',
            target: {
                mode: 'select',
                choices: {
                    'Use a Logos Card': ability.actions.use({
                        promptForSelect: {
                            location: 'play area',
                            controller: 'self',
                            cardCondition: card => card.hasHouse('logos')
                        }
                    }),
                    'Play a Logos Card': ability.actions.playCard({
                        promptForSelect: {
                            location: 'hand',
                            controller: 'self',
                            cardCondition: card => card.hasHouse('logos')
                        }
                    })
                }
            }
        });
    }
}

LogosAmbassador.id = 'logos-ambassador';

module.exports = LogosAmbassador;
