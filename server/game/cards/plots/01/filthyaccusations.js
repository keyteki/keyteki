const PlotCard = require('../../../plotcard.js');

class FilthyAccusations extends PlotCard {
    onReveal(player) {
        if(!this.inPlay || this.owner !== player) {
            return true;
        }

        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select character to kneel',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });
        return false;
    }

    cardCondition(card) {
        return card.getType() === 'character' && !card.kneeled;
    }

    onCardSelected(player, card) {
        if(!this.inPlay) {
            return false;
        }

        card.kneeled = true;

        this.game.addMessage('{0} uses {1} to kneel {2}', player, this, card);

        return true;
    }
}

FilthyAccusations.code = '01011';

module.exports = FilthyAccusations;
