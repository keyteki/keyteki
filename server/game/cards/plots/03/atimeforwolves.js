const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class ATimeForWolves extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                var direwolfCards = this.controller.searchDrawDeck(card => {
                    return card.hasTrait('Direwolf');
                });

                var buttons = _.map(direwolfCards, card => {
                    return { text: card.name, method: 'cardSelected', arg: card.uuid, card: card.getSummary(true) };
                });

                buttons.push({ text: 'Done', method: 'doneSelecting' });

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select a card to add to your hand',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    cardSelected(player, cardId) {
        var card = player.findCardByUuid(player.drawDeck, cardId);

        if(!card) {
            return false;
        }

        player.moveCard(card, 'hand');
        player.shuffleDrawDeck();

        if(card.getCost() > 3) {
            this.game.addMessage('{0} uses {1} to reveal {2} and add it to their hand', player, this, card);
            return true;
        }

        this.revealedCard = card;

        var buttons = [
            { text: 'Keep in hand', method: 'keepInHand' },
            { text: 'Put in play', method: 'putInPlay' }
        ];

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Put card into play?',
                buttons: buttons
            },

            source: this
        });

        return true;
    }

    keepInHand(player) {
        if(!this.revealedCard) {
            return false;
        }

        this.game.addMessage('{0} uses {1} to reveal {2} and add it to their hand', player, this, this.revealedCard);
        this.revealedCard = null;

        return true;
    }

    putInPlay(player) {
        if(!this.revealedCard) {
            return false;
        }

        this.game.addMessage('{0} uses {1} to reveal {2} and put it in play', player, this, this.revealedCard);
        player.playCard(this.revealedCard, true);
        this.revealedCard = null;

        return true;
    }

    doneSelecting(player) {
        player.shuffleDrawDeck();
        this.game.addMessage('{0} does not use {1} to find a card', player, this);
        return true;
    }
}

ATimeForWolves.code = '03046';

module.exports = ATimeForWolves;
