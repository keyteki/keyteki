const Card = require('../../Card.js');

class ProductiveTrash extends Card {
    // Play: You may discard a non-Mars card. If you do, a friendly creature captures 1A for each bonus icon on the discarded card.
    setupCardAbilities(ability) {
        this.play({
            preferActionPromptMessage: true,
            target: {
                optional: true,
                location: 'hand',
                controller: 'self',
                cardCondition: (card) => !card.hasHouse('mars'),
                gameAction: ability.actions.discard()
            },
            then: (preThenContext) => {
                if (!preThenContext.target || preThenContext.target.bonusIcons.length === 0) {
                    return { alwaysTriggers: true };
                }

                return {
                    alwaysTriggers: true,
                    gameAction: ability.actions.allocateCapture(() => ({
                        numAmber: preThenContext.target.bonusIcons.length,
                        controller: 'self',
                        menuTitle: 'Choose a creature to capture 1 amber'
                    }))
                };
            }
        });
    }
}

ProductiveTrash.id = 'productive-trash';

module.exports = ProductiveTrash;
