const Card = require('../../Card.js');

class Lancet extends Card {
    // Each friendly creature gains, “After Fight: Capture 1A.”
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.type === 'creature',
            effect: ability.effects.gainAbility('fight', {
                gameAction: ability.actions.capture()
            })
        });
    }
}

Lancet.id = 'lancet';

module.exports = Lancet;
