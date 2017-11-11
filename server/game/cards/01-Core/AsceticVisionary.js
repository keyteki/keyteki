const DrawCard = require('../../drawcard.js');

class AsceticVisionary extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Ready a character',
            cost: ability.costs.payFateToRing(1),
            condition: () => this.game.currentConflict && this.game.currentConflict.isAttacking(this),
            target: {
                cardType: 'character',
                cardCondition: card => card.bowed && card.location === 'play area' && (card.hasTrait('monk') || card.attachments.any(card => card.hasTrait('monk')))
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to unbow {2}', this.controller, this, context.target);
                this.controller.readyCard(context.target);
            }
        });
    }
}

AsceticVisionary.id = 'ascetic-visionary';

module.exports = AsceticVisionary;
