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
                gameAction: 'moveToConflict',
                cardCondition: card => card.location === 'play area' && card.controller === this.controller
            },
            handler: context => {
                if(context.target.inConflict) {
                    this.game.currentConflict.sendHome(context.target);
                    this.game.addMessage('{0} sacrifices {1} to send {2} home', this.controller, this, context.target);
                } else {
                    this.game.currentConflict.moveToConflict(context.target, this.game.currentConflict.attackingPlayer === context.target.controller);
                    this.game.addMessage('{0} sacrifices {1} to move {2} into the conflict', this.controller, this, context.target);
                }
            }
        });
    }
}

FavorableGround.id = 'favorable-ground';

module.exports = FavorableGround;
