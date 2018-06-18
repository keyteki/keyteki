const DrawCard = require('../../drawcard.js');

class KuniRitsuko extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Remove a fate',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player && context.source.isDefending()
            },
            target: {
                cardType: 'character',
                cardCondition: card => card.isAttacking(),
                gameAction: ability.actions.removeFate()
            }
        });
    }
}

KuniRitsuko.id = 'kuni-ritsuko';

module.exports = KuniRitsuko;
