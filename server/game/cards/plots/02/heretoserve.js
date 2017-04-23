const PlotCard = require('../../../plotcard.js');

class HereToServe extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    activePromptTitle: 'Select a card to put in play',
                    cardCondition: card => card.hasTrait('Maester') && card.getCost() <= 3 && this.controller.canPutIntoPlay(card),
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        this.game.addMessage('{0} uses {1} to put {2} into play', player, this, card);
        player.putIntoPlay(card);
    }

    doneSelecting(player) {
        this.game.addMessage('{0} does not use {1} to find a card', player, this);
    }
}

HereToServe.code = '02020';

module.exports = HereToServe;
