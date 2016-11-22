const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class Rebuilding extends PlotCard {
    onReveal(player) {
        if(!this.inPlay || this.owner !== player) {
            return true;
        }

        var buttons = [
            { text: 'Done', command: 'plot', method: 'doneSelect' }
        ];

        this.game.promptForSelect(player, this.onCardClicked.bind(this), 'Select cards', buttons);

        this.selecting = true;

        return false;
    }

    onCardClicked(player, cardId) {
        if(!this.inPlay || this.owner !== player) {
            return false;
        }

        var card = player.findCardByUuid(player.discardPile, cardId);
        if(!card) {
            return false;
        }

        var numSelected = player.discardPile.reduce((counter, card) => {
            if(!card.selected) {
                return counter;
            }

            return counter + 1;
        }, 0);

        if(card.selected && numSelected === 2) {
            return false;
        } else if(!card.selected && numSelected === 3) {
            return false;
        }

        card.selected = !card.selected;

        return false;
    }

    doneSelect(player) {
        if(!this.inPlay || this.owner !== player) {
            return;
        }

        var selected = player.discardPile.filter(card => {
            return card.selected;
        });

        var params = '';
        var paramIndex = 2;

        _.each(selected, card => {
            card.selected = false;

            player.discardPile = player.removeCardByUuid(player.discardPile, card.uuid);
            player.addCardToDrawDeck(card);
            player.shuffleDrawDeck();

            params += '{' + paramIndex++ + '} ';
        });

        if(!_.isEmpty(selected)) {
            this.game.addMessage('{0} uses {1} to shuffle ' + params + 'into their deck', player, this, ...selected);
        }

        this.selecting = false;
        player.selectCard = false;
        
        this.game.playerRevealDone(player);
    }

    leavesPlay() {
        this.selecting = false;
    }
}

Rebuilding.code = '01019';

module.exports = Rebuilding;
