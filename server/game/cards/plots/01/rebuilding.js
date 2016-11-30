const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class Rebuilding extends PlotCard {
    onReveal(player) {
        if(!this.inPlay || this.owner !== player) {
            return true;
        }

        this.game.promptForSelect(player, {
            numCards: 3,
            activePromptTitle: 'Select up to 3 cards from discard',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => this.cardCondition(card),
            onSelect: (player, cards) => this.doneSelect(player, cards)
        });

        return false;
    }

    cardCondition(card) {
        var player = card.owner;
        return this.owner === player && player.findCardByUuid(player.discardPile, card.uuid);
    }

    doneSelect(player, cards) {
        if(!this.inPlay) {
            return false;
        }

        var params = '';
        var paramIndex = 2;

        _.each(cards, card => {
            player.discardPile = player.removeCardByUuid(player.discardPile, card.uuid);
            player.addCardToDrawDeck(card);
            player.shuffleDrawDeck();

            params += '{' + paramIndex++ + '} ';
        });

        if(!_.isEmpty(cards)) {
            this.game.addMessage('{0} uses {1} to shuffle ' + params + 'into their deck', player, this, ...cards);
        }

        return true;
    }
}

Rebuilding.code = '01019';

module.exports = Rebuilding;
