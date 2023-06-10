const Card = require('../../Card.js');

class SafePlace extends Card {
    // You may spend <A> on Safe Place when forging keys.
    // Action: Move 1<A> from your pool to Safe Place.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.keyAmber()
        });

        this.action({
            cost: ability.costs.loseAmber(),
            gameAction: ability.actions.placeAmber()
        });
    }
}

SafePlace.id = 'safe-place';

module.exports = SafePlace;
