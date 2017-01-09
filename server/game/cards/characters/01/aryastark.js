const DrawCard = require('../../../drawcard.js');

class AryaStark extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardEntersPlay', 'onDupeDiscarded']);
    }

    onCardEntersPlay(event, card) {
        if(card !== this || card.controller.phase === 'setup') {
            return;
        }

        var dupe = this.controller.drawDeck.first();
        dupe.facedown = true;
        this.controller.removeCardFromPile(dupe);

        this.addDuplicate(dupe);

        this.game.addMessage('{0} places the top card of their deck on {1} as a duplicate', this.controller, this);
    }

    onDupeDiscarded(event, player, card) {
        if(this.controller !== player || card !== this || this.isBlank()) {
            return;
        }

        if(this.dupes.isEmpty() && this.iconAdded) {
            this.removeIcon('military');

            this.iconAdded = false;
        }
    }

    addDuplicate(card) {
        super.addDuplicate(card);

        if(this.isBlank()) {
            return;
        }

        if(this.dupes.size() >= 1 && !this.iconAdded) {
            this.addIcon('military');

            this.iconAdded = true;
        }
    }

    setBlank() {
        super.setBlank();

        if(this.isBlank() && this.iconAdded) {
            this.removeIcon('military');

            this.iconAdded = false;
        }
    }

    clearBlank() {
        super.clearBlank();

        if(!this.isBlank()) {
            if(this.dupes.size() >= 1 && !this.iconAdded) {
                this.addIcon('military');

                this.iconAdded = true;
            }            
        }
    }
}

AryaStark.code = '01141';

module.exports = AryaStark;
