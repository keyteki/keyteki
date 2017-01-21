const DrawCard = require('../../../drawcard.js');

class Left extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onDefendersDeclared']);
    }

    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.findCardByName(this.controller.cardsInPlay, 'Right'),
            match: this,
            effect: [
                ability.effects.modifyStrength(1),
                ability.effects.addIcon('power')
            ]
        });
    }

    onDefendersDeclared(event, challenge) {
        if(this.isBlank() || !challenge.isDefending(this)) {
            return;
        }

        if(this.controller.findCardByName(this.controller.cardsInPlay, 'Right')) {
            this.controller.standCard(this);
        }
    }
}

Left.code = '01179';

module.exports = Left;
