const Card = require('../../Card.js');

class ProductiveTrash extends Card {
    // Play: You may discard a non-Mars card. If you do, a friendly creature captures 1A for each bonus icon on the discarded card.
    setupCardAbilities(ability) {
        this.play({
            target: {
                optional: true,
                controller: 'self',
                location: 'hand',
                cardCondition: (card) => !card.hasHouse('mars'),
                gameAction: ability.actions.discard()
            },
            then: {
                target: {
                    activePromptTitle: 'Choose a friendly creature',
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.capture((context) => ({
                        amount:
                            context.preThenEvent && context.preThenEvent.card
                                ? context.preThenEvent.card.bonusIcons.length
                                : 0
                    }))
                }
            }
        });
    }
}

ProductiveTrash.id = 'productive-trash';

module.exports = ProductiveTrash;
