const Card = require('../../Card.js');

class StaticCharge extends Card {
    //This creature gains, "At the start of your turn, deal 2D to each of this creature's neighbors."
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reaction', {
                when: {
                    onBeginRound: (event, context) => context.player === this.game.activePlayer
                },
                gameAction: ability.actions.dealDamage((context) => ({
                    target: context.game.creaturesInPlay.filter((card) =>
                        context.source.neighbors.includes(card)
                    ),
                    amount: 2
                }))
            })
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Chinese and is subject to change."
          ]
        }*/
    }
}

StaticCharge.id = 'static-charge';

module.exports = StaticCharge;
