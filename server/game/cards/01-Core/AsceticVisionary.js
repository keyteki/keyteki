const DrawCard = require('../../drawcard.js');

class AsceticVisionary extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Ready a character',
            cost: ability.costs.payFateToRing(1),
            condition: context => context.source.isAttacking(),
            target: {
                cardType: 'character',
                cardCondition: card => card.hasTrait('monk') || card.attachments.any(card => card.hasTrait('monk')),
                gameAction: ability.actions.ready()
            }
        });
    }
}

AsceticVisionary.id = 'ascetic-visionary';

module.exports = AsceticVisionary;
