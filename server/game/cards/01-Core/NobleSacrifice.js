const DrawCard = require('../../drawcard.js');

class NobleSacrifice extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice honored character to discard dishonored one',
            cost: ability.costs.sacrifice(card => card.type === 'character' && card.isHonored),
            target: {
                cardType: 'character',
                cardCondition: card => card.isDishonored,
                gameAction: ability.actions.discardFromPlay()
            }
        });
    }
}

NobleSacrifice.id = 'noble-sacrifice';

module.exports = NobleSacrifice;
