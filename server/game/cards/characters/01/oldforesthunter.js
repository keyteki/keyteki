const DrawCard = require('../../../drawcard.js');
const AbilityLimit = require('../../../abilitylimit.js');

class OldForestHunter extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard a card to gain 1 gold',
            method: 'discard',
            limit: AbilityLimit.perPhase(1)
        });
    }

    discard(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card to discard',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'hand',
            onSelect: (p, card) => this.onCardSelected(p, card)
        });

        return true;
    }

    onCardSelected(player, card) {
        this.controller.discardCard(card);
        this.controller.gold += 1;

        this.game.addMessage('{0} uses {1} to discard {2} and gain 1 gold', player, this, card);

        return true;
    }
}

OldForestHunter.code = '01131';

module.exports = OldForestHunter;
