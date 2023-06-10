const Card = require('../../Card.js');

class Duskwitch extends Card {
    // Omega. (After you play this card, end this step.)
    // Elusive.(The first time this creature is attacked each turn, no damage is dealt.)
    // Your creatures enter play ready.
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
