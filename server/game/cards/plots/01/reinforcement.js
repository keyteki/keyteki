const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class Reinforcements extends PlotCard {
    onReveal(player) {
        if(!this.inPlay || this.owner !== player) {
            return true;
        }

        var buttons = [
            { text: 'Done', command: 'plot', method: 'doneSelect' }
        ];

        this.game.promptForSelectDeprecated(player, this.onCardClicked.bind(this), 'Select card', buttons);

        this.selecting = true;

        return false;
    }

    onCardClicked(player, cardId) {
        if(!this.inPlay || this.owner !== player) {
            return false;
        }

        var hand = false;

        var card = player.findCardByUuid(player.discardPile, cardId);
        if(!card) {
            card = player.findCardByUuid(player.hand, cardId);

            hand = true;

            if(!card) {
                return false;
            }    
        }

        if(card.getCost() > 5 || card.getType() !== 'character') {
            return false;
        }

        this.game.addMessage('{0} uses {1} to put {2} into play from their {3}', player, this, card, hand ? 'hand' : 'discard pile');

        player.playCard(card.uuid, true, hand ? player.hand : player.discardPile);

        if(!hand) {
            player.discardPile = player.removeCardByUuid(player.discardPile, card.uuid);
        }

        this.selecting = false;
        player.selectCard = false;
        
        this.game.playerRevealDone(player);

        return true;
    }

    doneSelect(player) {
        if(!this.inPlay || this.owner !== player || !this.selecting) {
            return;
        }

        this.game.cancelSelect(player);
        this.game.playerRevealDone(player);
    }
}

Reinforcements.code = '01020';

module.exports = Reinforcements;
