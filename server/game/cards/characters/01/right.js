const DrawCard = require('../../../drawcard.js');

class Right extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.findCardByName(this.controller.cardsInPlay, 'Left'),
            match: this,
            effect: [
                ability.effects.modifyStrength(1),
                ability.effects.addIcon('intrigue'),
                ability.effects.doesNotKneelAsDefender()
            ]
        });
    }
}

Right.code = '01184';

module.exports = Right;
