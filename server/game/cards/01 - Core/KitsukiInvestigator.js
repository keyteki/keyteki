const DrawCard = require('../../drawcard.js');

class KitsukiInvestigator extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Look at opponent\'s hand',
            condition: () => this.game.currentConflict && this.game.currentConflict.isParticipating(this) && this.game.currentConflict.conflictType === 'political',
            handler: () => {
                let opponent = this.controller.opponent;

                let buttons = opponent.hand.map(card => {
                    return { method: 'cardSelected', card: card };
                });

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select a card',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    cardSelected(player, cardId) {
        let opponent = this.controller.opponent;

        var card = opponent.findCardByUuid(opponent.hand, cardId);
        if(!card) {
            return false;
        }

        opponent.discardCard(card);

        this.game.addMessage('{0} uses {1} to discard {2} from {3}\'s hand', player, this, card, opponent);

        return true;
    }
}

KitsukiInvestigator.id = 'kitsuki-investigator';

module.exports = KitsukiInvestigator;
