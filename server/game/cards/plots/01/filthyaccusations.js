const PlotCard = require('../../../plotcard.js');

class FilthyAccusations extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    cardCondition: card => this.cardCondition(card),
                    activePromptTitle: 'Select character to kneel',
                    source: this,
                    gameAction: 'kneel',
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    cardCondition(card) {
        return card.getType() === 'character' && !card.kneeled;
    }

    onCardSelected(player, card) {
        player.kneelCard(card);

        this.game.addMessage('{0} uses {1} to kneel {2}', player, this, card);

        return true;
    }
}

FilthyAccusations.code = '01011';

module.exports = FilthyAccusations;
