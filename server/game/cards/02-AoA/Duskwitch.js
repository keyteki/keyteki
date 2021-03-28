const Card = require('../../Card.js');

class Duskwitch extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'any',
            match: (card) => card.type === 'creature',
            effect: ability.effects.entersPlayReady()
        });
    }
}

Duskwitch.id = 'duskwitch';

module.exports = Duskwitch;
