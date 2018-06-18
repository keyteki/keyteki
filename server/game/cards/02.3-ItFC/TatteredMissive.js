const DrawCard = require('../../drawcard.js');

class TatteredMissive extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search top 5 cards',
            condition: context => context.player.conflictDeck.size() > 0,
            cost: ability.costs.bowParent(),
            effect: 'look at the top 5 cards of their conflict deck',
            gameAction: ability.actions.deckSearch({ amount: 5 })
        });
    }

    canAttach(card, context) {
        if(!card.hasTrait('courtier') || card.controller !== context.player) {
            return false;
        }
        return super.canAttach(card, context);
    }
}

TatteredMissive.id = 'tattered-missive';

module.exports = TatteredMissive;
