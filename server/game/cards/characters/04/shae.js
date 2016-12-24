const DrawCard = require('../../../drawcard.js');

class Shae extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onPhaseEnd']);

        this.menu.push({ text: 'Pay 1 gold to stand Shae', command: 'card', method: 'stand' });

        this.tokens['gold'] = 0;
        this.usedThisPhase = 0;
    }

    stand(player) {
        if(!this.inPlay || this.controller !== player || this.usedThisPhase >= 2 || player.gold <= 0 || !this.kneeled) {
            return;
        }

        this.controller.gold--;
        this.kneeled = false;

        this.game.addMessage('{0} pays 1 gold to stand {1}', this.controller, this);

        this.usedThisPhase++;
    }

    onPhaseEnd() {
        this.usedThisPhase = 0;
    }
}

Shae.code = '04029';

module.exports = Shae;
