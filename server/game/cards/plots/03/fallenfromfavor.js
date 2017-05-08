
const PlotCard = require('../../../plotcard.js');

class FallenFromFavor extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a character to sacrifice',
                    source: this,
                    cardCondition: card =>
                        card.location === 'play area'
                        && card.controller === this.controller
                        && card.getType() === 'character',
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
