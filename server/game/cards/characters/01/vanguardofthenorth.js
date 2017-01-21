const DrawCard = require('../../../drawcard.js');

class VanguardOfTheNorth extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onAttackersDeclared']);
    }

    onAttackersDeclared(event, challenge) {
        var player = challenge.attackingPlayer;
        if(this.isBlank() || challenge.challengeType !== 'military' || !challenge.isAttacking(this)) {
            return;
        }

        if(player.activePlot.hasTrait('War')) {
            player.standCard(this);
        }
    }
}

VanguardOfTheNorth.code = '01151';

module.exports = VanguardOfTheNorth;
