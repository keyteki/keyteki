const Card = require('../../Card.js');

class Archimedes extends Card {
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
