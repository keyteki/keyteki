const DrawCard = require('../../../drawcard.js');

class Left extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.anyCardsInPlay(card => card.name === 'Right'),
            match: this,
            effect: [
                ability.effects.modifyStrength(1),
                ability.effects.addIcon('power'),
                ability.effects.doesNotKneelAsDefender()
            ]
        });
    }
}

Left.code = '01179';

module.exports = Left;
