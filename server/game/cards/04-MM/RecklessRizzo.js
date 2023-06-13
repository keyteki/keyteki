const Card = require('../../Card.js');

class RecklessRizzo extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // Action: Steal 2A. Until the start of your next turn, Reckless Rizzo loses elusive.
    setupCardAbilities(ability) {
        this.action({
            gameAction: [
                ability.actions.steal({ amount: 2 }),
                ability.actions.cardLastingEffect({
                    duration: 'untilNextTurn',
                    effect: ability.effects.removeKeyword('elusive')
                })
            ]
        });
    }
}

RecklessRizzo.id = 'reckless-rizzo';

module.exports = RecklessRizzo;
