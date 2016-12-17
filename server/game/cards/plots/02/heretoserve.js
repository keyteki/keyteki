const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class HereToServe extends PlotCard {
    onReveal(player) {
        if(!this.inPlay || this.controller !== player) {
            return true;
        }

        var maesterCards = player.searchDrawDeck(card => {
            return (card.hasTrait('Maester') && card.getCost() <= 3);
        });

        var buttons = _.map(maesterCards, card => {
            return { text: card.name, command: 'menuButton', method: 'cardSelected', arg: card.uuid, card: card.getSummary(true) };
        });

        buttons.push({ text: 'Done', command: 'menuButton', method: 'doneSelecting' });

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Select a card to put in play',
                buttons: buttons
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });

        return false;
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
