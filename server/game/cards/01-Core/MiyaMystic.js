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
                gameAction: 'discardFromPlay'
            },
            handler: context => {
                this.game.addMessage('{0} sacrifices {1} to discard {2}', context.player, this, context.target);
                this.game.applyGameAction(context, { discardFromPlay: context.target });
            }
        });
    }
}

MiyaMystic.id = 'miya-mystic';

module.exports = MiyaMystic;


