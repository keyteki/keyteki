const DrawCard = require('../../drawcard.js');

class KitsukiInvestigator extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Look at opponent\'s hand',
            max: ability.limit.perConflict(1),
            condition: () => this.game.currentConflict && this.game.currentConflict.isParticipating(this) && this.game.currentConflict.conflictType === 'political',
            cost: ability.costs.payFateToRing(1),
            handler: () => {
                this.game.promptWithHandlerMenu(this.controller, {
                    activePromptTitle: 'Choose card to discard',
                    cards: this.controller.opponent.hand.toArray(),
                    handlers: this.controller.opponent.hand.map(card => {
                        return () => {
                            let sortedHand = this.controller.opponent.hand.sortBy(card => card.name);
                            this.game.addMessage('{0} uses {1} to reveal {2}\'s hand: {3}', this.controller, this, this.controller.opponent, sortedHand);
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
