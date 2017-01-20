const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class TheBearAndTheMaidenFair extends DrawCard {
    play(player) {
        if(this.controller !== player) {
            return;
        }

        var buttons = _.map(this.game.getPlayers(), player => ({
            text: player.name, arg: player.name, method: 'selectPlayer'
        }));

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Choose a player',
                buttons: buttons
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });
    }

    selectPlayer(player, playerName) {
        this.selectedPlayer = this.game.getPlayerByName(playerName);

        if(!this.selectedPlayer) {
            return false;
        }

        this.game.addMessage('{0} uses {1} to look at the top 5 cards of {2}\'s deck', player, this, this.selectedPlayer);

        this.remainingCards = this.selectedPlayer.searchDrawDeck(5);
        this.cardsPlaced = 0;
        this.mode = 'bottom';
        this.promptToPlaceNextCard();

        return true;
    }

    promptToPlaceNextCard() {
        var buttons = _.map(this.remainingCards, card => ({
            text: card.name, method: 'selectCard', arg: card.uuid, card: card.getSummary(true)
        }));

        if(this.mode === 'bottom') {
            buttons.push({ text: 'Place top cards', method: 'placeTop' });
        }

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: this.mode === 'top' ? 'Choose card to place on top of deck' : 'Choose card to place on bottom of deck',
                buttons: buttons
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });
    }

    selectCard(player, cardId) {
        var card = _.find(this.remainingCards, card => card.uuid === cardId);

        if(!card) {
            return false;
        }

        this.remainingCards = _.reject(this.remainingCards, card => card.uuid === cardId);
        this.selectedPlayer.moveCard(card, 'draw deck', { bottom: this.mode === 'bottom' });
        this.cardsPlaced += 1;

        if(this.mode === 'bottom' && this.cardsPlaced >= 3) {
            this.placeTop();
        } else if(this.remainingCards.length > 0) {
            this.promptToPlaceNextCard();
        }

        if(this.remainingCards.length === 0) {
            this.game.addMessage('{0} placed {1} cards on the bottom of {2}\'s deck and the rest on top', this.controller, this.cardsOnBottom, this.selectedPlayer);
        }

        return true;
    }

    placeTop() {
        this.cardsOnBottom = this.cardsPlaced;
        this.mode = 'top';
        this.cardsPlaced = 0;
        this.promptToPlaceNextCard();

        return true;
    }
}

TheBearAndTheMaidenFair.code = '01197';

module.exports = TheBearAndTheMaidenFair;
