const Card = require('../../Card.js');

class SafePlace extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
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
