const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class GoldCloaks extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onPhaseEnded']);
    }

    onPhaseEnded() {
        if(!this.inPlay || !this.wasAmbush) {
            return;
        }

        this.controller.discardCard(this);

        this.game.addMessage('{0} is forced to discard {1} from play at the end of the phase', this.controller, this);
    }
}

GoldCloaks.code = '01092';

module.exports = GoldCloaks;
