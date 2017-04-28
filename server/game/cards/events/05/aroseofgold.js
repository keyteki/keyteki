const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class ARoseOfGold extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Look at top 3 cards of deck',
            phase: 'challenge',
            handler: () => {
                this.game.addMessage('{0} uses {1} to look at the top 3 cards of their deck', this.controller, this);

                this.remainingCards = this.controller.searchDrawDeck(3);

                var buttons = _.map(this.remainingCards, card => ({
                    method: 'selectCardForHand', card: card
                }));

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Choose a card to add to your hand',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    selectCardForHand(player, cardId) {
        var card = _.find(this.remainingCards, card => card.uuid === cardId);

        if(!card) {
            return false;
        }

        this.remainingCards = _.reject(this.remainingCards, card => card.uuid === cardId);
        this.controller.moveCard(card, 'hand');
        this.game.addMessage('{0} added a card to their hand', this.controller);
        this.promptToPlaceNextCard();

        return true;
    }

    promptToPlaceNextCard() {
        var buttons = _.map(this.remainingCards, card => ({
            method: 'selectCardForBottom', card: card
        }));

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Choose card to place on bottom of deck',
                buttons: buttons
            },
            source: this
        });
    }

    selectCardForBottom(player, cardId) {
        var card = _.find(this.remainingCards, card => card.uuid === cardId);

        if(!card) {
            return false;
        }

        this.remainingCards = _.reject(this.remainingCards, card => card.uuid === cardId);
        this.controller.moveCard(card, 'draw deck', { bottom: true });

        if(this.remainingCards.length > 0) {
            this.promptToPlaceNextCard();
        } else {
            this.game.addMessage('{0} placed the remaining cards on the bottom of their deck', this.controller);
        }

        return true;
    }
}

ARoseOfGold.code = '05038';

module.exports = ARoseOfGold;
