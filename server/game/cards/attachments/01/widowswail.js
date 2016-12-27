const DrawCard = require('../../../drawcard.js');

class WidowsWail extends DrawCard {
    attach(player, card) {
        card.strengthModifier += 2;

        if(card.name === 'Joffrey Baratheon') {
            card.setIcon('military');
        }
    }

    leavesPlay() {
        super.leavesPlay();

        this.parent.strengthModifier -= 2;

        if(this.parent.name === 'Joffrey Baratheon') {
            this.parent.clearIcon('military');
        }
    }
}

WidowsWail.code = '01096';

module.exports = WidowsWail;
