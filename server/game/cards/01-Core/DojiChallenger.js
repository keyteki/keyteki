const DrawCard = require('../../drawcard.js');

class DojiChallenger extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move a character into the conflict',
            condition: () => this.isAttacking(),
            target: {
                cardType: 'character',
                gameAction: 'moveToConflict',
                cardCondition: card => card.controller !== this.controller
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to move {2} into the conflict', this.controller, this, context.target);
                this.game.applyGameAction(context, { moveToConflict: context.target });
            }
        });
    }
}

DojiChallenger.id = 'doji-challenger';

module.exports = DojiChallenger;
