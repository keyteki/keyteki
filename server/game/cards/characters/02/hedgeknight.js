const DrawCard = require('../../../drawcard.js');
 
class HedgeKnight extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardPlayed', 'onCardLeftPlay']);
    }

    isControlAnotherKnight() {
        var numOtherKnights = this.controller.cardsInPlay.reduce((counter, card) => {
            if(this.isBlank() || !card.hasTrait('Knight') || card === this) {
                return counter;
            }

            return counter + 1;
        }, 0);

        return numOtherKnights >= 1;
    }

    addIconAndStr() {
        if(!this.iconAndStrAdded) {
            this.addIcon('power');
            this.strengthModifier++;

            this.iconAndStrAdded = true;
        }
    }

    removeIconAndStr() {
        if(this.iconAndStrAdded) {
            this.removeIcon('power');
            this.strengthModifier--;

            this.iconAndStrAdded = false;
        }
    }

    updateIconAndStr() {
        if(this.isControlAnotherKnight()) {
            this.addIconAndStr();
        } else {
            this.removeIconAndStr();
        }
    }

    onCardPlayed(event, player) {
        if(player !== this.controller) {
            return;
        }

        this.updateIconAndStr();
    }

    onCardLeftPlay(event, player) {
        if(player !== this.controller) {
            return;
        }

        this.updateIconAndStr();        
    }

    play() {
        super.play();

        this.updateIconAndStr();
    }

    leavesPlay() {       
        this.removeIconAndStr();

        super.leavesPlay();        
    }

    setBlank() {
        super.setBlank();

        if(this.isBlank()) {
            this.removeIconAndStr();
        }
    }

    clearBlank() {
        super.clearBlank();

        if(!this.isBlank()) {
            this.updateIconAndStr();
        }
    }
}

HedgeKnight.code = '02057';

module.exports = HedgeKnight;
