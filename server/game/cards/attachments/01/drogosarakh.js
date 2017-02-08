const DrawCard = require('../../../drawcard.js');

class DrogosArakh extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });
        this.whileAttached({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'military' &&
                this.controller.getNumberOfChallengesInitiatedByType('military') === 0
            ),
            match: card => card.name === 'Khal Drogo',
            effect: ability.effects.doesNotKneelAsAttacker()
        });
    }

    canAttach(player, card) {
        if(!card.hasTrait('dothraki')) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

DrogosArakh.code = '01172';

module.exports = DrogosArakh;
