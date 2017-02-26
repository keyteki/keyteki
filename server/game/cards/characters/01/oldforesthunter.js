const DrawCard = require('../../../drawcard.js');

class OldForestHunter extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard a card to gain 1 gold',
            method: 'discard',
            limit: ability.limit.perPhase(1)
        });
    }

    discard(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card to discard',
            source: this,
            cardCondition: card => card.location === 'hand',
            onSelect: (p, card) => this.onCardSelected(p, card)
        });

        return true;
    }

    onCardSelected(player, card) {
        this.controller.discardCard(card);
        this.game.addGold(this.controller, 1);

        this.game.addMessage('{0} uses {1} to discard {2} and gain 1 gold', player, this, card);

        return true;
    }
}

OldForestHunter.code = '01131';

module.exports = OldForestHunter;
