const _ = require('underscore');

const DrawCard = require('../../drawcard.js');

class StrengthInNumbers extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Send home defending character',
            condition: () => this.game.currentConflict && this.game.currentConflict.attackingPlayer === this.controller,
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                gameAction: 'sendHome',
                cardCondition: card => card.location === 'play area' && this.game.currentConflict.isDefending(card) && card.getGlory() <= _.size(_.filter(this.game.currentConflict.attackers))
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to send {2} home', this.controller, this, context.target);
                this.game.currentConflict.sendHome(context.target);
            }
        });
    }
}

StrengthInNumbers.id = 'strength-in-numbers';

module.exports = StrengthInNumbers;
