const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class ARoseOfGold extends DrawCard {
    canPlay(player, card) {
        if(player !== this.controller || this !== card) {
            return false;
        }

        if(this.game.currentPhase !== 'challenge') {
            return false;
        }

        return super.canPlay(player, card);
    }

    play(player) {
        if(this.controller !== player) {
            return;
        }

        this.game.addMessage('{0} uses {1} to look at the top 3 cards of their deck', player, this);

        this.remainingCards = this.controller.searchDrawDeck(3);

        var buttons = _.map(this.remainingCards, card => ({
            text: card.name, method: 'selectCardForHand', arg: card.uuid, card: card.getSummary(true)
        }));

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Choose a card to add to your hand',
                buttons: buttons
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
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
            text: card.name, method: 'selectCardForBottom', arg: card.uuid, card: card.getSummary(true)
        }));

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Choose card to place on bottom of deck',
                buttons: buttons
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
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
