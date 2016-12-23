const DrawCard = require('../../../drawcard.js');

class CerseiLannister extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onAttackersDeclared']);
    }

    onAttackersDeclared(e, challenge) {
        var player = challenge.attackingPlayer;
        if(!this.inPlay || this.controller !== player || challenge.challengeType !== 'intrigue') {
            return;
        }

        if(!this.isBlank() && challenge.isAttacking(this)) {
            this.kneeled = false;
        }
    }
}

CerseiLannister.code = '05001';

module.exports = CerseiLannister;
