const DrawCard = require('../../../drawcard.js');

class MaestersChain extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to discard condition',
            phase: 'dominance',
            cost: ability.costs.kneelSelf(),
            method: 'kneel'
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || !card.hasTrait('maester')) {
            return false;
        }
        return super.canAttach(player, card);
    }
    
    kneel(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a condition attachment to discard',
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

MaestersChain.code = '02117';

module.exports = MaestersChain;
