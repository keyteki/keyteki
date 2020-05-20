const Card = require('../../Card.js');

class MotherNorthelle extends Card {
    setupCardAbilities(ability) {
        this.reap({
            target: {
                activePromptTitle: 'Choose a captured amber to move to your pool.',
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => card.hasToken('amber'),
                gameAction: ability.actions.removeAmber()
            },
            effect: 'move 1 amber from {0} to their pool',
            then: {
                gameAction: ability.actions.gainAmber()
            }
        });
    }
}

MotherNorthelle.id = 'mother-northelle';

module.exports = MotherNorthelle;
