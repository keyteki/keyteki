const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class Summons extends PlotCard {
    revealed(player) {
        if(!this.inPlay || this.owner !== player) {
            return true;
        }

        var characters = player.searchDrawDeck(10, card => {
            return card.getType() === 'character';
        });

        var buttons = _.map(characters, card => {
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

Summons.code = '01022';

module.exports = Summons;
