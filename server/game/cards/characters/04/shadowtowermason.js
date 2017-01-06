const DrawCard = require('../../../drawcard.js');
 
class ShadowTowerMason extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardPlayed', 'onCardLeftPlay']);
    }

    getCardCount() {
        var count = this.controller.cardsInPlay.reduce((counter, card) => {
            if(this.isBlank() || card.getFaction() !== 'thenightswatch' || (card.getType() !== 'location' && card.getType() !== 'attachment')) {
                return counter;
            }

            return counter + 1;
        }, 0);

        return count;
    }

    addIcons() {
        if(!this.iconsAdded) {
            this.addIcon('military');
            this.addIcon('intrigue');

            this.iconsAdded = true;
        }
    }

    removeIcons() {
        if(this.iconsAdded) {
            this.removeIcon('military');
            this.removeIcon('intrigue');

            this.iconsAdded = false;
        }
    }

    updateIcons() {
        if(this.getCardCount() >= 3) {
            this.addIcons();
        } else {
            this.removeIcons();
        }
    }

    onCardPlayed(event, player) {
        if(player !== this.controller) {
            return;
        }

        this.updateIcons();
    }

    onCardLeftPlay(event, player) {
        if(player !== this.controller) {
            return;
        }

        this.updateIcons();        
    }

    play() {
        super.play();

        this.updateIcons();
    }

    leavesPlay() {
        super.leavesPlay();

        this.removeIcons();
    }

    setBlank() {
        super.setBlank();

        if(this.isBlank()) {
            this.removeIcons();
        }
    }

    clearBlank() {
        super.clearBlank();

        if(!this.isBlank()) {
            this.updateIcons();
        }
    }
}

ShadowTowerMason.code = '04065';

module.exports = ShadowTowerMason;
