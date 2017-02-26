const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class Rebuilding extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    numCards: 3,
                    activePromptTitle: 'Select up to 3 cards from discard',
                    source: this,
                    cardCondition: card => this.cardCondition(card),
                    onSelect: (player, cards) => this.doneSelect(player, cards)
                });
            }
        });
    }

    cardCondition(card) {
        var player = card.controller;
        return this.controller === player && player.findCardByUuid(player.discardPile, card.uuid);
    }

    doneSelect(player, cards) {
        _.each(cards, card => {
            player.moveCard(card, 'draw deck');
            player.shuffleDrawDeck();
        });

        if(!_.isEmpty(cards)) {
            this.game.addMessage('{0} uses {1} to shuffle {2} into their deck', player, this, cards);
        }

        return true;
    }
}

Rebuilding.code = '01019';

module.exports = Rebuilding;
