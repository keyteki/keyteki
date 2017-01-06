const DrawCard = require('../../../drawcard.js');
const AbilityLimit = require('../../../abilitylimit.js');

class SyrioForel extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give a character military icon and stealth',
            method: 'giveIcon',
            limit: AbilityLimit.perPhase(1)
        });
    }

    giveIcon(player) {
        if(this.location !== 'play area' || player.phase !== 'challenge' || this.controller !== player) {
            return false;
        }

        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select a character',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });

        return true;
    }

    cardCondition(card) {
        return card.getType() === 'character' && card.controller === this.controller;
    }

    onCardSelected(player, card) {
        this.selectedCard = card;

        card.addIcon('military');
        card.addKeyword('Stealth');

        this.game.addMessage('{0} uses {1} to give {2} a {3} icon and stealth until the end of the phase', player, this, card, 'military');

        this.game.once('onPhaseEnded', () => {
            this.onPhaseEnded();
        });

        return true;
    }

    onPhaseEnded() {
        if(this.selectedCard) {
            this.selectedCard.removeIcon('military');
            this.selectedCard.removeKeyword('Stealth');
            this.selectedCard = undefined;
        }
    }
}

SyrioForel.code = '02037';

module.exports = SyrioForel;
