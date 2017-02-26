const DrawCard = require('../../../drawcard.js');

class MaesterCressen extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to discard condition',
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            method: 'kneel'
        });
    }

    kneel(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select an attachment to discard',
            source: this,
            cardCondition: card => card.location === 'play area' && card.getType() === 'attachment' && card.hasTrait('condition'),
            onSelect: (p, card) => this.onCardSelected(p, card)
        });

        return true;
    }

    onCardSelected(player, card) {
        player.discardCard(card);

        this.game.addMessage('{0} uses {1} to discard {2}', player, this, card);

        return true;
    }
}

MaesterCressen.code = '01046';

module.exports = MaesterCressen;
