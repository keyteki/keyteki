const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class BuildingOrders extends PlotCard {
    onReveal(player) {
        if(!this.inPlay || this.owner !== player) {
            return true;
        }

        var attachmentsAndLocations = player.searchDrawDeck(10, card => {
            return card.getType() === 'attachment' || card.getType() === 'location';
        });

        var buttons = _.map(attachmentsAndLocations, card => {
            return { text: card.name, command: 'plot', method: 'cardSelected', arg: card.uuid };
        });

        buttons.push({ text: 'Done', command: 'plot', method: 'doneSelecting' });

        player.buttons = buttons;
        player.menuTitle = 'Select a card to add to your hand';

        return false;
    }

    cardSelected(player, cardId) {
        if(this.owner !== player) {
            return;
        }

        var card = player.findCardByUuid(player.drawDeck, cardId);

        if(!card) {
            return;
        }

        player.moveFromDrawDeckToHand(card);
        player.shuffleDrawDeck();

        this.game.addMessage('{0} uses {1} to reveal {2} and add it to their hand', player, this, card);

        this.game.playerRevealDone(player);
    }

    doneSelecting(player) {
        if(this.owner !== player) {
            return;
        }
        
        this.game.playerRevealDone(player);
    }
}

BuildingOrders.code = '01006';

module.exports = BuildingOrders;
