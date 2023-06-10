const Card = require('../../Card.js');

class TheCommonCold extends Card {
    // Play: Deal 1D to each creature. You may destroy all Mars creatures.
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 1 damage to all creatures',
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 1,
                target: context.game.creaturesInPlay
            })),
            then: {
                may: 'destroy all Mars creatures',
                gameAction: ability.actions.destroy((context) => ({
                    target: context.game.creaturesInPlay.filter((card) => card.hasHouse('mars'))
                }))
            }
        });
    }
}

TheCommonCold.id = 'the-common-cold';

module.exports = TheCommonCold;
