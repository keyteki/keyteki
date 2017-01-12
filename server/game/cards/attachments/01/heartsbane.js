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

        this.controller.kneelCard(this);
        this.untilEndOfChallenge(ability => ({
            match: card => card === this.parent,
            effect: ability.effects.modifyStrength(3)
        }));

        this.game.addMessage('{0} kneels {1} to give {2} +3 STR until the end of the challenge', player, this, this.parent);

        return true;
    }

    canAttach(player, card) {
        if(card.getFaction() !== 'tyrell') {
            return false;
        }

        return super.canAttach(player, card);
    }
}

Heartsbane.code = '01191';

module.exports = Heartsbane;
