const DrawCard = require('../../drawcard.js');

class Charge extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put a character into play from a province',
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictType === 'military',
            target: {
                cardType: 'character',
                location: 'province',
                controller: 'self',
                gameAction: ability.actions.putIntoConflict()
            }
        });
    }
}

Charge.id = 'charge';

module.exports = Charge;
