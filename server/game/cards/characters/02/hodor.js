const DrawCard = require('../../../drawcard.js');

class Hodor extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onAttackerSelected']);
    }

    onAttackerSelected(event, challenge, card) {
        var player = challenge.attackingPlayer;
        if(!this.inPlay || this.controller !== player || card !== this) {
            return;
        }

        if(!player.findCardByName(player.cardsInPlay, 'Bran Stark')) {
            event.cancel = true;
        }
    }

    modifyDominance(player, strength) {
        if(!this.inPlay || this.controller !== player || this.kneeled) {
            return strength;
        }

        return strength - this.getStrength();
    }
}

Hodor.code = '02061';

module.exports = Hodor;
