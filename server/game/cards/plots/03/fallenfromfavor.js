
const PlotCard = require('../../../plotcard.js');

class FallenFromFavor extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a character to sacrifice',
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                    cardCondition: card => card.controller === this.controller && card.getType() === 'character',
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    onCardSelected(player, card) {
        player.sacrificeCard(card);

        this.game.addMessage('{0} sacrifices {1} for {2}', player, card, this);

        return true;
    }
}

FallenFromFavor.code = '03047';

module.exports = FallenFromFavor;
