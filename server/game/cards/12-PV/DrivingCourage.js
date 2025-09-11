const Card = require('../../Card.js');

class DrivingCourage extends Card {
    // Play: Ready and use a friendly Mutant creature.
    // Fate: Exhaust each friendly non-Mutant creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => card.hasTrait('mutant'),
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.use()
                ])
            },
            effect: 'ready and use {0}'
        });

        this.fate({
            gameAction: ability.actions.exhaust((context) => ({
                target: context.game.activePlayer.creaturesInPlay.filter(
                    (card) => !card.hasTrait('mutant')
                )
            })),
            effect: 'exhaust each friendly non-Mutant creature'
        });
    }
}

DrivingCourage.id = 'driving-courage';

module.exports = DrivingCourage;
