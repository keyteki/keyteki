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
        this.untilEndOfPhase(ability => ({
            match: card,
            effect: [
                ability.effects.removeIcon('military'),
                ability.effects.removeIcon('intrigue'),
                ability.effects.removeIcon('power')
            ]
        }));

        return true;
    }
}

Confinement.code = '01121';

module.exports = Confinement;
