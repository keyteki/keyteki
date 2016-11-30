const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class AryaStark extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onDupeDiscarded']);
    }

    play(player) {
        super.play(player);

        var dupe = this.drawDeck.first(1);
        player.drawDeck = _(player.drawDeck.rest(1));

        this.dupes.push(dupe);
        this.setIcon('military');

        this.game.addMessage('{0} places the top card of their deck on {1} as a duplicate', player, this);
    }

    onDupeDiscarded(player, card) {
        if(this.owner !== player || card !== this) {
            return;
        }

        if(this.dupes.isEmpty()) {
            this.clearIcon('military');
        }
    }

    addDuplicate(card) {
        super.addDuplicate(card);

        if(this.dupes.size() === 1) {
            this.setIcon('military');
        }
    }
}

AryaStark.code = '01141';

module.exports = AryaStark;
