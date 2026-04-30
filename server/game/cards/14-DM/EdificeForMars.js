const Card = require('../../Card.js');

class EdificeForMars extends Card {
    // Play: Destroy a non-Mars artifact. If you do, you may ready a friendly card.
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose an artifact',
                cardType: 'artifact',
                cardCondition: (card) => !card.hasHouse('mars'),
                gameAction: ability.actions.destroy()
            },
            then: {
                target: {
                    optional: true,
                    activePromptTitle: 'Choose a card',
                    controller: 'self',
                    gameAction: ability.actions.ready()
                }
            }
        });
    }
}

EdificeForMars.id = 'edifice-for-mars';

module.exports = EdificeForMars;
