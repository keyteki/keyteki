const DrawCard = require('../../drawcard.js');

class CloudTheMind extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.blank
        });
    }
        
    
    canPlay() {
        if(!this.controller.cardsInPlay.any(card => card.getType() === 'character' && card.hasTrait('shugenja'))) {
            return false;
        }
        
        return super.canPlay();
    }
}

CloudTheMind.id = 'cloud-the-mind';

module.exports = CloudTheMind;


