const Card = require('../../Card.js');

class RecklessRizzo extends Card {
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
