const Card = require('../../Card.js');

class EkwirresFulcrum extends Card {
    // At the end of each player's turn, they may gain 1. If they do,
    // their opponent draws 2 cards.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onTurnEnded: () => true
            },
            useEventPlayer: true,
            optional: true,
            gameAction: [
                ability.actions.gainAmber(),
                ability.actions.conditional({
                    condition: (context) => !!context.player.opponent,
                    trueGameAction: ability.actions.draw((context) => ({
                        target: context.player.opponent,
                        amount: 2
                    }))
                })
            ]
        });
    }
}

EkwirresFulcrum.id = 'ekwirrĕ-s-fulcrum';

module.exports = EkwirresFulcrum;
