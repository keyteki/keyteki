const Card = require('../../Card.js');

class EmpoweredZark extends Card {
    // After Fight: Capture 2A. If there are 3A or more on Empowered Zark, you may move 3A from it to the common supply and ready each non-Agent Mars creature.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.capture({ amount: 2 }),
            then: (preThenContext) => ({
                alwaysTriggers: true,
                may: 'move amber to common supply',
                condition: () => preThenContext.source.amber >= 3,
                gameAction: ability.actions.sequential([
                    ability.actions.removeAmber({
                        target: preThenContext.source,
                        amount: 3
                    }),
                    ability.actions.ready((context) => ({
                        target: context.game.creaturesInPlay.filter(
                            (card) => card.hasHouse('mars') && !card.hasTrait('agent')
                        )
                    }))
                ])
            })
        });
    }
}

EmpoweredZark.id = 'empowered-zark';

module.exports = EmpoweredZark;
