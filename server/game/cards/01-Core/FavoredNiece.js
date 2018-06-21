const DrawCard = require('../../drawcard.js');

class FavoredNiece extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard then draw a card',
            limit: ability.limit.perRound(2),
            cost: ability.costs.discardCard(card => card.location === 'hand'),
            gameAction: ability.actions.draw()
        });
    }
}

FavoredNiece.id = 'favored-niece';

module.exports = FavoredNiece;
