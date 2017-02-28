const DrawCard = require('../../../drawcard.js');

class Heartsbane extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel this card to give attached character +3 STR',
            condition: () =>
                this.parent
                && this.game.currentChallenge
                && this.game.currentChallenge.isParticipating(this.parent),
            cost: ability.costs.kneelSelf(),
            method: 'kneel'
        });
    }

    kneel(player) {
        this.untilEndOfChallenge(ability => ({
            match: card => card === this.parent,
            effect: ability.effects.modifyStrength(3)
        }));

        this.game.addMessage('{0} kneels {1} to give {2} +3 STR until the end of the challenge', player, this, this.parent);

        return true;
    }

    canAttach(player, card) {
        if(!card.isFaction('tyrell')) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

Heartsbane.code = '01191';

module.exports = Heartsbane;
