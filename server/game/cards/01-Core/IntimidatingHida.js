const DrawCard = require('../../drawcard.js');

class IntimidatingHida extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Make opponent lose honor',
            when: {
                onConflictPass: (event, context) => event.conflict.attackingPlayer === context.player.opponent
            },
            gameAction: ability.actions.loseHonor()
        });
    }
}

IntimidatingHida.id = 'intimidating-hida';

module.exports = IntimidatingHida;
