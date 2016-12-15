const DrawCard = require('../../../drawcard.js');
 
class SealOfTheHand extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.menu.push({ text: 'Stand attached character', method: 'kneel' });
    }

    kneel(player) {
        if(!this.inPlay || !this.parent || !this.parent.kneeled) {
            return;
        }

        this.parent.kneeled = false;
        this.kneeled = true;

        this.game.addMessage('{0} kneels {1} to stand {2}', player, this, this.parent);
    }

    canAttach(player, card) {
        if(!card.hasTrait('Lady') && !card.hasTrait('Lord')) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

SealOfTheHand.code = '01032';

module.exports = SealOfTheHand;
