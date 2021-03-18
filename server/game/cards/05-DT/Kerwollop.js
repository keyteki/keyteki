const Card = require('../../Card.js');

class Kerwollop extends Card {
    //Play: Deal 1D to each creature. Gain 1A for each creature destroyed this way.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.game.creaturesInPlay
            })),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.gainAmber((context) => ({
                    amount: context.preThenEvents.filter(
                        (event) => event.card.location !== 'play area'
                    ).length
                })),
                message: '{0} gains amber for each creature destroyed this way'
            }
        });
    }
}

Kerwollop.id = 'kerwollop';

module.exports = Kerwollop;
