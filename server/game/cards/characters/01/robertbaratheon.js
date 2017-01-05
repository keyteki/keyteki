const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class RobertBaratheon extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardPlayed', 'onCardLeftPlay', 'onCardKneeled', 'onCardStood']);
    }

    calculateStrength() {
        var otherPlayer = this.game.getOtherPlayer(this.controller);
        var cardsInPlay = [];

        if(!otherPlayer) {
            cardsInPlay = this.controller.cardsInPlay.value();
        } else {
            cardsInPlay = this.controller.cardsInPlay.union(otherPlayer.cardsInPlay.value());
        }

        this.strengthModifier = _.reduce(cardsInPlay, (counter, card) => {
            if(card.getType() !== 'character' || !card.kneeled) {
                return counter;
            }

            return counter + 1;
        }, 0);
    }

    play(player) {
        super.play(player);

        this.calculateStrength();
    }

    onCardPlayed(event) {
        this.calculateStrength();
    }

    onCardLeftPlay(event) {
        this.calculateStrength();
    }

    onCardKneeled(event, player, card) {
        if(card.getType() !== 'character') {
            return;
        }

        this.calculateStrength();
    }

    onCardStood(event, player, card) {
        if(card.getType() !== 'character') {
            return;
        }

        this.calculateStrength();
    }
}

RobertBaratheon.code = '01048';

module.exports = RobertBaratheon;
