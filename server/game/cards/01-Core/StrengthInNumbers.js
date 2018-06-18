const DrawCard = require('../../drawcard.js');

class StrengthInNumbers extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Send home defending character',
            condition: context => context.player.isAttackingPlayer(),
            target: {
                cardType: 'character',
                cardCondition: card => card.isDefending() && card.getGlory() <= this.game.currentConflict.attackers.length,
                gameAction: ability.actions.sendHome()
            },
            cannotBeMirrored: true
        });
    }
}

StrengthInNumbers.id = 'strength-in-numbers';

module.exports = StrengthInNumbers;
