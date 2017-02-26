const PlotCard = require('../../../plotcard.js');

class CloseCall extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    cardCondition: card => this.cardCondition(card),
                    activePromptTitle: 'Select a character',
                    source: this,
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    cardCondition(card) {
        return card.getType() === 'character' && card.location === 'dead pile';
    }

    onCardSelected(player, card) {
        player.moveCard(card, 'discard pile');

        this.game.addMessage('{0} uses {1} to move {2} to their discard pile', player, this, card);

        var otherPlayer = this.game.getOtherPlayer(player);
        if(!otherPlayer || !otherPlayer.activePlot.hasTrait('Winter')) {
            player.drawCardsToHand(1);
            this.game.addMessage('{0} uses {1} to draw 1 card', player, this);
        }

        return true;
    }
}

CloseCall.code = '02120';

module.exports = CloseCall;
