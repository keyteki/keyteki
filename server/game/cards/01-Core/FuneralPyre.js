const DrawCard = require('../../drawcard.js');

class FuneralPyre extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice a character to draw',
            cost: ability.costs.sacrifice(card => card.type === 'character'),
            gameAction: ability.actions.draw()
        });
    }
}

FuneralPyre.id = 'funeral-pyre';

module.exports = FuneralPyre;
