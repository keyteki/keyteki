const DrawCard = require('../../drawcard.js');

class KitsukiInvestigator extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Look at opponent\'s hand',
            condition: () => this.game.currentConflict && this.game.currentConflict.isParticipating(this) && this.game.currentConflict.conflictType === 'political',
            handler: () => {
                this.game.promptWithHandlerMenu(this.controller, {
                    activePromptTitle: 'Choose card to discard',
                    choices: this.controller.opponent.hand.map(card => card.name),
                    handlers: this.controller.opponent.hand.map(card => {
                        return () => {
                            this.game.addMessage('{0} uses {1} to discard {2} from {3}\'s hand', this.controller, this, card, this.controller.opponent);
                            this.controller.opponent.discardCardFromHand(card);
                        };
                    }),
                    source: this
                });
            }
        });
    }
}

KitsukiInvestigator.id = 'kitsuki-investigator';

module.exports = KitsukiInvestigator;
