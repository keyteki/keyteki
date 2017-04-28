const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class TheBearAndTheMaidenFair extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Look at top 5 cards of a deck',
            handler: () => {
                var buttons = _.map(this.game.getPlayers(), player => ({
                    text: player.name, arg: player.name, method: 'selectPlayer'
                }));

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Choose a player',
                        buttons: buttons
                    },
                    source: this
                });
            }
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
            method: 'selectCard', card: card
        }));

        if(this.mode === 'bottom') {
            buttons.push({ text: 'Place top cards', method: 'placeTop' });
        }

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: this.mode === 'top' ? 'Choose card to place on top of deck' : 'Choose card to place on bottom of deck',
                buttons: buttons
            },
            source: this
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
