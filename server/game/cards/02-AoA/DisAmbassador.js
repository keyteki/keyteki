const Card = require('../../Card.js');

class DisAmbassador extends Card {
    setupCardAbilities(ability) {
        this.reap({
            fight: true,
            effect: 'allow them to play or use one Dis card this turn',
            target: {
                mode: 'select',
                choices: {
                    'Use a Dis Card': ability.actions.use({
                        promptForSelect: {
                            location: 'play area',
                            controller: 'self',
                            cardCondition: card => card.hasHouse('dis')
                        }
                    }),
                    'Play a Dis Card': ability.actions.playCard({
                        promptForSelect: {
                            location: 'hand',
                            controller: 'self',
                            cardCondition: card => card.hasHouse('dis')
                        }
                    })
                }
            }
        });
    }
}

DisAmbassador.id = 'dis-ambassador';

module.exports = DisAmbassador;
