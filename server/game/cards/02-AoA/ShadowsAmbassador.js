const Card = require('../../Card.js');

class ShadowsAmbassador extends Card {
    setupCardAbilities(ability) {
        this.reap({
            fight: true,
            effect: 'allow them to play or use one Shadows card this turn',
            target: {
                mode: 'select',
                choices: {
                    'Use a Shadows Card': ability.actions.use({
                        promptForSelect: {
                            location: 'play area',
                            controller: 'self',
                            cardCondition: card => card.hasHouse('shadows')
                        }
                    }),
                    'Play a Shadows Card': ability.actions.playCard({
                        promptForSelect: {
                            location: 'hand',
                            controller: 'self',
                            cardCondition: card => card.hasHouse('shadows')
                        }
                    })
                }
            }
        });
    }
}

ShadowsAmbassador.id = 'shadows-ambassador';

module.exports = ShadowsAmbassador;
