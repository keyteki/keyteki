const DrawCard = require('../../../drawcard.js');

class SerJaimeLannister extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onAttackersDeclared']);
    }

    onAttackersDeclared(event, challenge) {
        var player = challenge.attackingPlayer;
        if(challenge.challengeType !== 'military') {
            return;
        }

        this.untilEndOfChallenge(ability => ({
            match: this,
            effect: ability.effects.addKeyword('renown')
        }));

        if(this.controller !== player) {
            return;
        }

        if(!this.isBlank() && challenge.isAttacking(this)) {
            player.standCard(this);
        }
    }
}

SerJaimeLannister.code = '01087';

module.exports = SerJaimeLannister;
