const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class DaenerysTargaryen extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onAttackersDeclared', 'onDefendersDeclared', 'afterChallenge']);
    }

    modifyStrength(challenge) {
        var opponentCards = challenge.getOpponentCards(this.controller);

        _.each(opponentCards, card => {
            card.strengthModifier--;
        });

        challenge.calculateStrength();
    
        this.game.addMessage('{0} uses {1} to add -1 to the strength of each opponent\'s participating character for this challenge', this.controller, this);

        this.strengthModified = true;
    }

    onAttackersDeclared(event, challenge) {
        if(this.kneeled || challenge.attackingPlayer === this.controller || this.isBlank()) {
            return;
        }

        this.modifyStrength(challenge);
    }

    onDefendersDeclared(event, challenge) {
        if(this.kneeled || challenge.defendingPlayer === this.controller || this.isBlank()) {
            return;
        }

        this.modifyStrength(challenge);
    }    

    afterChallenge(event, challenge) {
        if(!this.strengthModified || this.isBlank()) {
            return;
        }

        var opponentCards = challenge.getOpponentCards(this.controller);

        _.each(opponentCards, card => {
            card.strengthModifier++;
        });
    }
}

DaenerysTargaryen.code = '01160';

module.exports = DaenerysTargaryen;
