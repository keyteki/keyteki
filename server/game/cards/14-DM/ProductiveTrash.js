const Card = require('../../Card.js');

class ProductiveTrash extends Card {
    // Play: You may discard a non-Mars card. If you do, a friendly creature captures 1A for each bonus icon on the discarded card.
    setupCardAbilities(ability) {
        this.play({
            effect: 'discard a non-Mars card and capture amber for each bonus icon',
            target: {
                optional: true,
                location: 'hand',
                controller: 'self',
                cardCondition: (card) => !card.hasHouse('mars'),
                gameAction: ability.actions.discard()
            },
            then: (preThenContext) => ({
                alwaysTriggers: true,
                gameAction: ability.actions.sequentialForEach(() => ({
                    num: preThenContext.target ? preThenContext.target.bonusIcons.length : 0,
                    action: ability.actions.capture({
                        promptForSelect: {
                            cardType: 'creature',
                            controller: 'self'
                        }
                    })
                }))
            })
        });
    }
}

ProductiveTrash.id = 'productive-trash';

module.exports = ProductiveTrash;
