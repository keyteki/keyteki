const DrawCard = require('../../../drawcard.js');

class PriestOfTheDrownedGod extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardPlayed']);
    }

    play(player) {
        super.play(player);

        player.cardsInPlay.each(card => {
            if(card.getType() === 'character' && card.hasTrait('Drowned God')) {
                card.strengthModifier++;
            }
        });
    }

    onCardPlayed(e, player, card) {
        if(this.controller !== player || this.isBlank()) {
            return;
        }

        if(card.getType() === 'character' && card.hasTrait('Drowned God')) {
            card.strengthModifier++;
        }
    }

    leavesPlay() {
        super.leavesPlay();
        
        if(this.isBlank()) {
            return;
        }

        this.controller.cardsInPlay.each(card => {
            if(card.getType() === 'character' && card.hasTrait('Drowned God')) {
                card.strengthModifier--;
            }
        });
    }
}

PriestOfTheDrownedGod.code = '02072';

module.exports = PriestOfTheDrownedGod;
