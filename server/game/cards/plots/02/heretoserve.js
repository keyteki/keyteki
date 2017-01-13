const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class HereToServe extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                var maesterCards = this.controller.searchDrawDeck(card => {
                    return (card.hasTrait('Maester') && card.getCost() <= 3);
                });

                var buttons = _.map(maesterCards, card => {
                    return { text: card.name, method: 'cardSelected', arg: card.uuid, card: card.getSummary(true) };
                });

                buttons.push({ text: 'Done', method: 'doneSelecting' });

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select a card to put in play',
                        buttons: buttons
                    },
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name
                });
            }
        });
    }

    cardSelected(player, cardId) {
        var card = player.findCardByUuid(player.drawDeck, cardId);

        if(!card) {
            return false;
        }

        player.shuffleDrawDeck();
        this.game.addMessage('{0} uses {1} to put {2} into play', player, this, card);
        player.playCard(card, true);

        return true;
    }

    doneSelecting(player) {
        player.shuffleDrawDeck();
        this.game.addMessage('{0} does not use {1} to find a card', player, this);

        return true;
    }
}

HereToServe.code = '02020';

module.exports = HereToServe;
