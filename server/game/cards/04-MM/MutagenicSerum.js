const Card = require('../../Card.js');

class MutagenicSerum extends Card {
    // Omni: Destroy Mutagenic Serum. You may use friendly Mutant creatures this turn.
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
