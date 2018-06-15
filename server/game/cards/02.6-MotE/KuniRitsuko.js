const DrawCard = require('../../drawcard.js');

class KuniRitsuko extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Remove a fate',
            when: {
                afterConflict: event => event.conflict.winner === this.controller && event.conflict.isDefending(this)
            },
            target: {
                cardType: 'character',
                gameAction: 'removeFate',
                cardCondition: card => card.isAttacking()
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to remove a fate from {2}', this.controller, this, context.target);
                this.game.applyGameAction(context, { removeFate: context.target });
            }
        });
    }
}

KuniRitsuko.id = 'kuni-ritsuko';

module.exports = KuniRitsuko;
