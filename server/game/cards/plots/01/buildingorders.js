const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class BuildingOrders extends PlotCard {
    onReveal(player) {
        if(!this.inPlay || this.controller !== player) {
            return true;
        }

        var attachmentsAndLocations = player.searchDrawDeck(10, card => {
            return card.getType() === 'attachment' || card.getType() === 'location';
        });

        var buttons = _.map(attachmentsAndLocations, card => {
            return { text: card.name, command: 'menuButton', method: 'cardSelected', arg: card.uuid };
        });
        buttons.push({ text: 'Done', command: 'menuButton', method: 'doneSelecting' });

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Select a card to add to your hand',
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

        player.moveCard(card, 'hand');
        player.shuffleDrawDeck();

        this.game.addMessage('{0} uses {1} to reveal {2} and add it to their hand', player, this, card);

        return true;
    }

    doneSelecting(player) {
        player.shuffleDrawDeck();
        this.game.addMessage('{0} does not use {1} to add a card to their hand', player, this);
        return true;
    }
}

BuildingOrders.code = '01006';

module.exports = BuildingOrders;
