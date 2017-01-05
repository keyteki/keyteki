const DrawCard = require('../../../drawcard.js');

class Nightmares extends DrawCard {
    play(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character or location',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'play area' && (card.getType() === 'character' || card.getType() === 'location'),
            onSelect: (player, card) => this.onCardSelected(player, card)
        });
    }

    onCardSelected(player, card) {
        this.selectedCard = card;

        card.setBlank();

        this.game.addMessage('{0} uses {1} to treat the text box of {2} as blank until the end of the phase', player, this, card);

        this.game.once('onPhaseEnded', () => {
            this.onPhaseEnded();
        });

        return true;
    }

    onPhaseEnded() {
        if(this.selectedCard) {
            this.selectedCard.clearBlank();

            this.selectedCard = undefined;
        }
    }
}

Nightmares.code = '02099';

module.exports = Nightmares;
