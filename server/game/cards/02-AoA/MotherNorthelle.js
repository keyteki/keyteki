const Card = require('../../Card.js');

class MotherNorthelle extends Card {
    // Elusive.(The first time this creature is attacked each turn, no damage is dealt.)
    // Reap: Move 1A from a friendly creature to your pool.
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
