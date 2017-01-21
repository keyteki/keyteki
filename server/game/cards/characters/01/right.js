const DrawCard = require('../../../drawcard.js');

class Right extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onDefendersDeclared']);
    }

    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.findCardByName(this.controller.cardsInPlay, 'Left'),
            match: this,
            effect: [
                ability.effects.modifyStrength(1),
                ability.effects.addIcon('intrigue')
            ]
        });
    }

    onDefendersDeclared(event, challenge) {
        if(this.isBlank() || !challenge.isDefending(this)) {
            return;
        }

        if(this.controller.findCardByName(this.controller.cardsInPlay, 'Left')) {
            this.controller.standCard(this);
        }
    }
}

Right.code = '01184';

module.exports = Right;
