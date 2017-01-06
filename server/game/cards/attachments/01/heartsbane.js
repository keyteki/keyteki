const DrawCard = require('../../../drawcard.js');

class Heartsbane extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Kneel this card to give attached card +3 STR',
            method: 'kneel'
        });
    }

    kneel(player) {
        if(!this.parent || this.kneeled || !this.game.currentChallenge || !this.game.currentChallenge.isParticipating(this.parent)) {
            return false;
        }

        this.triggered = true;
        this.parent.strengthModifier += 3;

        this.game.once('onChallengeFinished', this.onChallengeFinished.bind(this));

        this.game.addMessage('{0} kneels {1} to give {2} +3 STR until the end of the challenge', player, this, this.parent);

        return true;
    }

    canAttach(player, card) {
        if(card.getFaction() !== 'tyrell') {
            return false;
        }

        return super.canAttach(player, card);
    }

    onChallengeFinished() {
        if(this.triggered) {
            this.parent.strengthModifier -= 3;

            this.triggered = false;
        }
    }
}

Heartsbane.code = '01191';

module.exports = Heartsbane;
