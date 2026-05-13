const Card = require('../../Card.js');

class Commpod extends Card {
    // Action: Reveal any number of Mars cards from your hand. For each card revealed this way, you may ready one Mars creature.
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
                            optional: true,
                            activePromptTitle: 'Choose a creature to ready',
                            cardType: 'creature',
                            cardCondition: (card) => card.hasHouse('mars'),
                            controller: 'self'
                        }
                    })
                }))
            },
            effect: '{1}',
            effectArgs: (context) => {
                const n = context.target.length;
                return n
                    ? `reveal ${n} Mars card${n === 1 ? '' : 's'} and ready a creature ${n} time${
                          n === 1 ? '' : 's'
                      }`
                    : 'reveal no Mars cards from their hand';
            }
        });
    }
}

Commpod.id = 'commpod';

module.exports = Commpod;
