const DrawCard = require('../../../drawcard.js');

class GoldCloaks extends DrawCard {
    setupCardAbilities() {
        this.forcedInterrupt({
            when: {
                onPhaseEnded: () => this.wasAmbush
            },
            handler: () => {
                this.controller.discardCard(this);
                this.game.addMessage('{0} is forced to discard {1} from play at the end of the phase', this.controller, this);
            }
        });
    }
}

GoldCloaks.code = '01092';

module.exports = GoldCloaks;
