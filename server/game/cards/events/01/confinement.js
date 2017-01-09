const DrawCard = require('../../../drawcard.js');

class Confinement extends DrawCard {
    play(player) {
        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select a character',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });

        return true;
    }

    cardCondition(card) {
        return card.location === 'play area' && card.getType() === 'character' && card.getStrength() <= 4;
    }

    onCardSelected(player, card) {
        card.removeIcon('military');
        card.removeIcon('intrigue');
        card.removeIcon('power');

        this.cardSelected = card;

        this.game.once('onPhaseEnded', this.onPhaseEnded.bind(this));

        return true;
    }

    onPhaseEnded() {
        if(this.cardSelected) {
            this.cardSelected.addIcon('military');
            this.cardSelected.addIcon('intrigue');
            this.cardSelected.addIcon('power');

            this.cardSelected = undefined;
        }
    }
}

Confinement.code = '01121';

module.exports = Confinement;
