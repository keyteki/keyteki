const DrawCard = require('../../drawcard.js');

class TatteredMissive extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search top 5 cards',
            condition: () => this.controller.conflictDeck.size() > 0,
            cost: ability.costs.bowParent(),
            handler: () => {
                let cards = this.controller.conflictDeck.first(5);
                if(cards.length > 1) {
                    this.game.addMessage('{0} bows {1} to use {2} to look at the top 5 cards of their conflict deck', this.controller, this.parent, this);
                    this.game.promptWithHandlerMenu(this.controller, {
                        activePromptTitle: 'Select a card to reveal and put in your hand',
                        cards: cards,
                        cardHandler: card => {
                            this.game.addMessage('{0} reveals {1} and adds it to their hand', this.controller, card);
                            this.controller.moveCard(card, 'hand');
                            this.controller.shuffleConflictDeck();
                        },
                        source: this
                    });
                } else {
                    this.game.addMessage('{0} reveals {1} and adds it to their hand', this.controller, cards[0]);
                    this.controller.moveCard(cards[0], 'hand');
                }
            }
        });
    }

    canAttach(card) {
        if(!card.hasTrait('courtier') || card.controller !== this.controller) {
            return false;
        }
        return super.canAttach(card);
    }
}

TatteredMissive.id = 'tattered-missive';

module.exports = TatteredMissive;
