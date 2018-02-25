const DrawCard = require('../../drawcard.js');

class AsceticVisionary extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Ready a character',
            cost: ability.costs.payFateToRing(1),
            condition: () => this.isAttacking(),
            target: {
                cardType: 'character',
                gameAction: 'ready',
                cardCondition: card => card.hasTrait('monk') || card.attachments.any(card => card.hasTrait('monk'))
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to unbow {2}', this.controller, this, context.target);
                this.game.applyGameAction(context, { ready: context.target });
            }
        });
    }
}

AsceticVisionary.id = 'ascetic-visionary';

module.exports = AsceticVisionary;
