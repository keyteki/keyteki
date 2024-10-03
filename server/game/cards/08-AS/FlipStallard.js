const Card = require('../../Card.js');

class FlipStallard extends Card {
    // Each enemy creature loses each of its destroyed abilities.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            match: (card) => card.type === 'creature',
            effect: ability.effects.blankDestroyed()
        });
    }
}

FlipStallard.id = 'flip-stallard';

module.exports = FlipStallard;
