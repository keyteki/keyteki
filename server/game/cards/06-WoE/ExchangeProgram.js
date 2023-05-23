const Card = require('../../Card.js');

class ExchangeProgram extends Card {
    // Play: Choose a friendly flank creature and an enemy flank
    // creature. If you do, swap control of those creatures.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.creaturesInPlay.length > 0 &&
                context.player.opponent.creaturesInPlay.length > 0,
            targets: {
                first: {
                    cardType: 'creature',
                    controller: 'self',
                    cardCondition: (card) => card.isOnFlank()
                },
                second: {
                    dependsOn: 'first',
                    cardType: 'creature',
                    controller: 'opponent',
                    cardCondition: (card) => card.isOnFlank(),
                    gameAction: ability.actions.swap((context) => ({
                        origin: context.targets.first
                    }))
                }
            }
        });
    }
}

ExchangeProgram.id = 'exchange-program';

module.exports = ExchangeProgram;
