const Card = require('../../Card.js');

class Archimedes extends Card {
    // Elusive.(The first time this creature is attacked each turn, no damage is dealt.)
    // Each of Archimedess neighbors gains, Destroyed: Archive this creature.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => context.source.neighbors.includes(card),
            effect: ability.effects.gainAbility('destroyed', {
                effect: 'return {0} to their archives',
                gameAction: ability.actions.archive()
            })
        });
    }
}

Archimedes.id = 'archimedes';

module.exports = Archimedes;
