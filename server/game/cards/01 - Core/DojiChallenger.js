const DrawCard = require('../../drawcard.js');

class DojiChallenger extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move a character into the conflict',
            condition: () => this.game.currentConflict && this.game.currentConflict.isAttacking(this),
            target: {
                cardType: 'character',
                cardCondition: card => card.location === 'play area' && !this.game.currentConflict.isParticipating(card) && card.controller !== this.controller && card.allowGameAction('moveToConflict')
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to move {2} into the conflict', this.controller, this, context.target);
                this.game.currentConflict.moveToConflict(context.target);
            }
        });
    }
}

DojiChallenger.id = 'doji-challenger';

module.exports = DojiChallenger;
