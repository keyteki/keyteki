const DrawCard = require('../../../drawcard.js');

class CerseiLannister extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onAttackersDeclared']);
    }

    onAttackersDeclared(event, challenge) {
        var player = challenge.attackingPlayer;
        if(challenge.challengeType !== 'intrigue' || player !== this.controller) {
            return;
        }

        this.untilEndOfChallenge(ability => ({
            match: this.controller.activePlot,
            effect: ability.effects.modifyClaim(1)
        }));
    }
}

CerseiLannister.code = '01084';

module.exports = CerseiLannister;
