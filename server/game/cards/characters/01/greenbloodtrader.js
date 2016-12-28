const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class GreenbloodTrader extends DrawCard {
    play(player) {
        super.play(player);

        if(player.phase !== 'marshal') {
            return;
        }

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Look at top 2 cards', method: 'trigger' },
                    { text: 'Cancel', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });
    }

    trigger(player) {
        if(this.isBlank() || this.controller !== player) {
            return false;
        }

        this.top2Cards = player.drawDeck.first(2);

        var buttons = _.map(this.top2Cards, card => {
            return { text: card.name, method: 'cardSelected', arg: card.uuid, card: card.getSummary(true) };
        });

        buttons.push({ text: 'Continue', method: 'continueWithoutSelecting' });

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Add a card to hand?',
                buttons: buttons
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });

        return true;
    }

    getCard(player, cardId) {
        if(this.isBlank() || this.controller !== player) {
            return undefined;
        }

        var card = player.findCardByUuid(player.drawDeck, cardId);
        if(!card) {
            return undefined;
        }

        return card;
    }

    cardSelected(player, cardId) {
        var card = this.getCard(player, cardId);
        if(!card) {
            return false;
        }

        player.moveCard(card, 'hand');

        player.moveFromTopToBottomOfDrawDeck(1);

        this.game.addMessage('{0} uses {1} to draw 2 cards, draw 1 and place the other on the bottom of their deck', player, this);

        return true;
    }

    moveToBottom(player, cardId) {
        var card = this.getCard(player, cardId);
        if(!card) {
            return false;
        }

        var otherCard = _.find(this.top2Cards, c => {
            return c.uuid === card.uuid;
        });

        player.drawDeck.value().shift();
        player.drawDeck.value().shift();

        player.drawDeck.push(otherCard);
        player.drawDeck.push(card);

        this.game.addMessage('{0} uses {1} to draw 2 cards, and place them on the bottom of their deck', player, this);

        return true;
    }

    continueWithoutSelecting(player) {
        var buttons = _.map(this.top2Cards, card => {
            return { text: card.name, method: 'moveToBottom', arg: card.uuid, card: card.getSummary(true) };
        });

        buttons.push({ text: 'Cancel', method: 'cancel' });

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Select card to place on the bottom of the deck',
                buttons: buttons
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });

        return true;
    }

    cancel(player) {
        if(this.isBlank() || this.controller !== player) {
            return false;
        }

        this.game.addMessage('{0} declines to trigger {1}', player, this);
        return true;
    }
}

GreenbloodTrader.code = '01112';

module.exports = GreenbloodTrader;
