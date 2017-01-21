const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class JonSnow extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onAttackersDeclared']);
    }

    onAttackersDeclared(event, challenge) {
        if(this.kneeled || this.controller !== challenge.attackingPlayer) {
            return;
        }

        if(!_.any(challenge.attackers, card => {
            return card.getFaction() === 'thenightswatch';
        })) {
            return;
        }

        challenge.addAttacker(this);
        this.controller.standCard(this);

        this.game.addMessage('{0} uses {1} to add {1} to the challenge as an attacker', this.controller, this);
    }
}

JonSnow.code = '01124';

module.exports = JonSnow;
