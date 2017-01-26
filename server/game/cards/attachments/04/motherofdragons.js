const DrawCard = require('../../../drawcard.js');

class MotherOfDragons extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Kneel Mother of Dragons to add attached character to challenge',
            method: 'addToChallenge',
            phase: 'challenge'
        });
    }

    addToChallenge(player) {
        var challenge = this.game.currentChallenge;
        if(this.kneeled || !player.cardsInPlay.any(card => {
            return challenge.isParticipating(card) && card.hasTrait('Dragon');
        })) {
            return false;
        }
        this.controller.kneelCard(this);
        if(challenge.attackingPlayer === player) {
            challenge.addAttacker(this.parent);
            this.game.addMessage('{0} uses {1} to add {2} to the challenge as an attacker with strength {3}', this.controller, this, this.parent, this.parent.getStrength());
        } else {
            challenge.addDefender(this.parent);
            this.game.addMessage('{0} uses {1} to add {2} to the challenge as a defender with strength {3}', this.controller, this, this.parent, this.parent.getStrength());
        }
        this.controller.standCard(this.parent);
    }

    canAttach(player, card) {
        if(!card.hasTrait('Stormborn')) {
            return false;
        }
        return super.canAttach(player, card);
    }       
}

MotherOfDragons.code = '04094';

module.exports = MotherOfDragons;
