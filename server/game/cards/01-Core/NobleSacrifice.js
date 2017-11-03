const DrawCard = require('../../drawcard.js');

class NobleSacrifice extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice friendly character',
            cost: ability.costs.sacrifice(card => card.type === 'character' && card.isHonored),
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                gameAction: 'discardCardFromPlay',
                cardCondition: card => card.location === 'play area' && card.isDishonored
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to sacrifice {2} in order to discard {3}', this.controller, this, context.costs.sacrifice, context.target);
                this.controller.discardCardFromPlay(context.target);
            }
        });
    }
}

NobleSacrifice.id = 'noble-sacrifice';

module.exports = NobleSacrifice;
