const DrawCard = require('../../drawcard.js');

class IdeMessenger extends DrawCard {
    setupCardAbilities(ability) {
        this.action ({
            title: 'Move an ally to a conflict',
            condition: () => this.game.currentConflict && this.controller.getStats().fate > 0,
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                cardCondition: (
                    card => card.allowGameAction('moveToConflict') &&
                    this.game.currentConflict.isParticipating(card) === false &&
                    card.location === 'play area' &&
                    card.controller === this.controller
                )
            },
            cost: ability.costs.payFate(1),
            handler: context => {
                this.game.addMessage('{0} uses {1} to move {2} to the conflict', this.controller, this, context.target);
                this.game.currentConflict.moveToConflict(context.target, this.game.currentConflict.attackingPlayer === this.controller);
            }

        });
    }
}

IdeMessenger.id = 'ide-messenger';

module.exports = IdeMessenger;