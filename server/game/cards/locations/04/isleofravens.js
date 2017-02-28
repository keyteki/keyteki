const DrawCard = require('../../../drawcard.js');

class IsleOfRavens extends DrawCard {

    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to shuffle a discarded card back into its owner\'s deck',
            cost: ability.costs.kneelSelf(),
            method: 'kneel'
        });
    }

    kneel(player) {
        this.game.promptForSelect(player, {
            cardCondition: card => card.location === 'discard pile',
            activePromptTitle: 'Select a discarded card',
            source: this,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });
    }

    onCardSelected(player, card) {
        card.controller.moveCard(card, 'draw deck');
        card.controller.shuffleDrawDeck();

        this.game.addMessage('{0} kneels {1} to shuffle {2} back into {3}\'s deck',
                             player, this, card, card.controller);

        return true;
    }

}

IsleOfRavens.code = '04078';

module.exports = IsleOfRavens;
