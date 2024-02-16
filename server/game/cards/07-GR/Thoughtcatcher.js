const Card = require('../../Card.js');

class Thoughtcatcher extends Card {
    // Each friendly creature with A on it gains, “Destroyed: Draw 1
    // card.”
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.type === 'creature' && card.amber > 0,
            effect: ability.effects.gainAbility('destroyed', {
                gameAction: ability.actions.draw()
            })
        });
    }
}

Thoughtcatcher.id = 'thoughtcatcher';

module.exports = Thoughtcatcher;
