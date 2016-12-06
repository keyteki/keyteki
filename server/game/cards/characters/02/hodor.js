const DrawCard = require('../../../drawcard.js');
 
class Hodor extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);
        
        this.registerEvents(['onAttackerSelected']);
    }

    onAttackerSelected(event, player, card) {
        if(!this.inPlay || this.owner !== player || card !== this) {
            return;
        }

        if(!player.findCardByName(player.cardsInPlay, 'Bran Stark')) {
            event.cancel = true;
        }
    }

    modifyDominance(player, strength) {
        if(!this.inPlay || this.owner !== player) {
            return strength;
        }

        return strength - this.getStrength();
    }
}

Hodor.code = '02061';

module.exports = Hodor;
