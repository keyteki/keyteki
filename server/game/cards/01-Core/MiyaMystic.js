const DrawCard = require('../../drawcard.js');

class MiyaMystic extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice to discard an attachment',
            cost: ability.costs.sacrificeSelf(),
            phase: 'conflict',
            target: {
                activePromptTitle: 'Select an attachment',
                cardType: 'attachment',
                cardCondition: card => card.location === 'play area'
            },
            handler: context => {
                this.game.addMessage('{0} sacrifices {1} to discard {2}', context.cardStateWhenInitiated.controller, this, context.target);
                this.controller.removeAttachment(context.target);
            }
        });
    }
}

MiyaMystic.id = 'miya-mystic';

module.exports = MiyaMystic;


