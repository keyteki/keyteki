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
                    amount:
                        1 *
                        context.preThenEvents.filter(
                            (event) => event.name === 'onCardDestroyed' && !event.cancelled
                        ).length
                }))
            }
        });
    }
}

Kerwollop.id = 'kerwollop';

module.exports = Kerwollop;
