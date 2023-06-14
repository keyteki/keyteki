const Card = require('../../Card.js');

class BreakerHill extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // Each of Breaker Hills neighbors gains, Action: Steal 1A.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => context.source.neighbors.includes(card),
            effect: ability.effects.gainAbility('action', {
                gameAction: ability.actions.steal()
            })
        });
    }
}

BreakerHill.id = 'breaker-hill';

module.exports = BreakerHill;
