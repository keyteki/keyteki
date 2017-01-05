const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class Unsullied extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onDefendersDeclared', 'afterChallenge']);
    }

    onDefendersDeclared(event, challenge) {
        if(challenge.defendingPlayer === this.controller || !challenge.isAttacking(this) || this.isBlank()) {
            return;
        }

        var opponentCards = challenge.getOpponentCards(this.controller);

        _.each(opponentCards, card => {
            card.strengthModifier--;
        });

        challenge.calculateStrength();
    
        this.game.addMessage('{0} uses {1} to add -1 to the strength of each opponent\'s defending characters for this challenge', this.controller, this);

        this.strengthModified = true;
    }    

    afterChallenge(event, challenge) {
        if(!this.strengthModified) {
            return;
        }

        var opponentCards = challenge.getOpponentCards(this.controller);

        _.each(opponentCards, card => {
            card.strengthModifier++;
        });
    }
}

Unsullied.code = '01171';

module.exports = Unsullied;
