const Card = require('../../Card.js');

class UntamedAmbassador extends Card {
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            effect: 'allow them to play or use one Untamed card this turn',
            target: {
                mode: 'select',
                choices: {
                    'Use a Untamed Card': ability.actions.use({
                        promptForSelect: {
                            location: 'play area',
                            controller: 'self',
                            cardCondition: card => card.hasHouse('untamed')
                        }
                    }),
                    'Play a Untamed Card': ability.actions.playCard({
                        promptForSelect: {
                            location: 'hand',
                            controller: 'self',
                            cardCondition: card => card.hasHouse('untamed')
                        }
                    })
                }
            }
        });
    }
}

UntamedAmbassador.id = 'untamed-ambassador';

module.exports = UntamedAmbassador;
