const DrawCard = require('../../drawcard.js');

class FavorableGround extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Use Favorable Ground',
            condition: () => this.game.currentConflict,
            cost: ability.costs.sacrificeSelf(),
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                cardCondition: card => card.location === 'play area' && card.controller === this.controller && (card.allowGameAction('sendHome') || card.allowGameAction('moveToConflict'))
            },
            handler: context => {
                if(context.target.inConflict && context.target.allowGameAction('sendHome')) {
                    this.game.currentConflict.sendHome(context.target);
                    this.game.addMessage('{0} sacrifices {1} to send {2} home', this.controller, this, context.target);
                } else if(context.target.allowGameAction('moveToConflict')) {
                    this.game.currentConflict.moveToConflict(context.target);
                    this.game.addMessage('{0} sacrifices {1} to move {2} into the conflict', this.controller, this, context.target);
                }
            }
        });
    }
}

FavorableGround.id = 'favorable-ground';

module.exports = FavorableGround;
