const Card = require('../../Card.js');

class Commpod extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                activePromptTitle: 'Choose which cards to reveal',
                mode: 'unlimited',
                controller: 'self',
                location: 'hand',
                cardCondition: (card) => card.hasHouse('mars'),
                gameAction: ability.actions.sequentialForEach((context) => ({
                    num: context.target.length,
                    action: ability.actions.ready({
                        promptForSelect: {
                            activePromptTitle: 'Choose a creature to ready',
                            cardType: 'creature',
                            controller: 'self'
                        }
                    })
                }))
            },
            effect: 'reveal {0} and to ready a creature {1} times',
            effectArgs: (context) => context.target.length
        });
    }
}

Commpod.id = 'commpod';

module.exports = Commpod;
