const Card = require('../../Card.js');

class AggressiveRush extends Card {
    //Play: Deal 1D to each creature. Gain 1A for each creature destroyed this way.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.game.creaturesInPlay,
                amount: 1
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
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Chinese and is subject to change."
          ]
        }*/
    }
}

AggressiveRush.id = 'aggressive-rush';

module.exports = AggressiveRush;
