const Card = require('../../Card.js');

class MutagenicSerum extends Card {
    setupCardAbilities(ability) {
        this.omni({
            gameAction: [
                ability.actions.sacrifice(),
                ability.actions.forRemainderOfTurn({
                    effect: ability.effects.canUse(
                        (card) => card.type === 'creature' && card.hasTrait('mutant')
                    )
                })
            ]
        });
    }
}

MutagenicSerum.id = 'mutagenic-serum';

module.exports = MutagenicSerum;
