const DrawCard = require('../../../drawcard.js');

class DrogosArakh extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onAttackersDeclared']);
    }

    onAttackersDeclared(event, challenge) {
        if(challenge.challengeType !== 'military' || !challenge.isAttacking(this.parent) || this.parent.name !== 'Khal Drogo' || this.controller.getNumberOfChallengesInitiated() > 1) {
            return;
        }

        this.parent.kneeled = false;
    }

    canAttach(player, card) {
        if(!card.hasTrait('dothraki')) {
            return false;
        }

        return super.canAttach(player, card);
    }

    attach(player, card) {
        card.strengthModifier += 2;

        super.attach(player, card);
    }

    leavesPlay() {
        super.leavesPlay();

        this.parent.strengthModifier--;
    }
}

DrogosArakh.code = '01172';

module.exports = DrogosArakh;
