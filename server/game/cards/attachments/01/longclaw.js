const DrawCard = require('../../../drawcard.js');

class Longclaw extends DrawCard {
    attach(player, card) {
        card.strengthModifier++;
        card.addKeyword('Renown');
    }

    leavesPlay() {
        super.leavesPlay();

        this.parent.strengthModifier--;
        this.parent.removeKeyword('Renown');
    }
}

Longclaw.code = '01135';

module.exports = Longclaw;
