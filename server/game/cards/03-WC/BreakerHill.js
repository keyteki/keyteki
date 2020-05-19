const Card = require('../../Card.js');

class BreakerHill extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => this.neighbors.includes(card),
            effect: ability.effects.gainAbility('action', {
                gameAction: ability.actions.steal()
            })
        });
    }
}

BreakerHill.id = 'breaker-hill';

module.exports = BreakerHill;
