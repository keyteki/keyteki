const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class GreenbloodTrader extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this
            },
            handler: () => {
                this.top2Cards = this.controller.drawDeck.first(2);

                var buttons = _.map(this.top2Cards, card => {
                    return { method: 'cardSelected', card: card };
                });

                buttons.push({ text: 'Continue', method: 'continueWithoutSelecting' });

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Add a card to hand?',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
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

        this.game.addMessage('{0} uses {1} to draw 2 cards, keep 1 and place the other on the bottom of their deck', player, this);

        return true;
    }

    moveToBottom(player, cardId) {
        var card = this.getCard(player, cardId);
        if(!card) {
            return false;
        }

        var otherCard = _.find(this.top2Cards, c => {
            return c.uuid !== card.uuid;
        });

        player.moveCard(otherCard, 'draw deck', { bottom: true });
        player.moveCard(card, 'draw deck', { bottom: true });

        this.game.addMessage('{0} uses {1} to draw 2 cards, and place them on the bottom of their deck', player, this);

        return true;
    }

    continueWithoutSelecting(player) {
        var buttons = _.map(this.top2Cards, card => {
            return { method: 'moveToBottom', card: card };
        });

        buttons.push({ text: 'Cancel', method: 'cancel' });

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Select card to place on the bottom of the deck',
                buttons: buttons
            },
            source: this
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
