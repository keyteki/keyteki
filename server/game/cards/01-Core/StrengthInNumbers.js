const DrawCard = require('../../drawcard.js');

class StrengthInNumbers extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Send home defending character',
            condition: () => this.controller.isAttackingPlayer(),
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                gameAction: 'sendHome',
                cardCondition: card => card.getGlory() <= this.game.currentConflict.attackers.length && card.isDefending()
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to send {2} home', this.controller, this, context.target);
                this.game.applyGameAction(context, { sendHome: context.target });
            }
        });
    }
}

StrengthInNumbers.id = 'strength-in-numbers';

module.exports = StrengthInNumbers;
