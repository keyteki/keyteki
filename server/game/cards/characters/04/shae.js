const DrawCard = require('../../../drawcard.js');

class Shae extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.tokens['gold'] = 0;
    }

    setupCardAbilities() {
        this.action({
            title: 'Pay 1 gold to stand Shae',
            method: 'stand',
            phase: 'challenge'
        });
    }

    stand(player) {
        if(player.gold <= 0 || !this.kneeled) {
            return false;
        }

        this.controller.gold--;
        this.kneeled = false;

        this.game.addMessage('{0} pays 1 gold to stand {1}', this.controller, this);
    }
}

Shae.code = '04029';

module.exports = Shae;
