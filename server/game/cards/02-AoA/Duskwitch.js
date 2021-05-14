const Card = require('../../Card.js');

class Duskwitch extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.entersPlayReady()
        });

        this.persistentEffect({
            targetLocation: 'any',
            match: (card, context) => card !== context.source && card.type === 'creature',
            effect: ability.effects.entersPlayReady()
        });
    }
}

Duskwitch.id = 'duskwitch';

module.exports = Duskwitch;
