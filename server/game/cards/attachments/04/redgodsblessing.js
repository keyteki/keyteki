const DrawCard = require('../../../drawcard.js');
 
class RedGodsBlessing extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardPlayed', 'onCardLeftPlay']);
    }

    getNumberOfCardsWithRhllor() {
        var cardsWithRhllor = this.controller.cardsInPlay.reduce((runningTotal, c) => {
            if(c.hasTrait('R\'hllor') && c.getType() === 'character') {
                return runningTotal + 1;
            }

            return runningTotal;
        }, 0);

        return cardsWithRhllor;        
    }

    attach(player, card) {
        card.addTrait('R\'hllor');

        card.strengthModifier += this.getNumberOfCardsWithRhllor();
    }
    

    leavesPlay() {
        super.leavesPlay();

        this.parent.removeTrait('R\'hllor');

        this.parent.strengthModifier -= this.getNumberOfCardsWithRhllor();
    }

    onCardPlayed(event, player, card) {
        if(!this.inPlay || this.controller !== player) {
            return;
        }

        if(card.getType() === 'character' && card.hasTrait('R\'hllor')) {
            card.strengthModifier++;
        }
    }

    onCardLeftPlay(event, player, card) {
        if(!this.inPlay || this.controller !== player) {
            return;
        }
    
        if(card.getType() === 'character' && card.hasTrait('R\'hllor')) {
            card.strengthModifier--;
        }
    }    
}

RedGodsBlessing.code = '04068';

module.exports = RedGodsBlessing;
