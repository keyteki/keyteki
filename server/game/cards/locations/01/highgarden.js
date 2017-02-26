const DrawCard = require('../../../drawcard.js');

class Highgarden extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel this card',
            cost: ability.costs.kneelSelf(),
            condition: () => this.controller.gold >= 1 && this.game.currentChallenge,
            method: 'kneel'
        });
    }

    kneel(player) {
        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select character',
            source: this,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });
    }

    cardCondition(card) {
        return card.getType() === 'character' && card.location === 'play area' && this.game.currentChallenge.isAttacking(card);
    }

    onCardSelected(player, card) {
        this.controller.gold -= 1;

        this.game.currentChallenge.removeFromChallenge(card);
        card.controller.standCard(card);

        this.game.addMessage('{0} kneels {1} and pays 1 gold to stand {2} and remove it from the challenge', player, this, card);

        return true;
    }
}

Highgarden.code = '01192';

module.exports = Highgarden;
