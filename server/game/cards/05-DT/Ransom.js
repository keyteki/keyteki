const Card = require('../../Card.js');

class Ransom extends Card {
    //This creature cannot be used, and gains, “At the start of your turn, you may give your opponent 2A. If you do, destroy $this.”
    //This card has been translated from Russian and is subject to change.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.cardCannot('use'),
                ability.effects.gainAbility('reaction', {
                    when: {
                        onBeginRound: (event, context) => context.player === this.game.activePlayer
                    },
                    may: 'Do something',
                    gameAction: ability.actions.transferAmber({ amount: 2 }),
                    then: {
                        gameAction: ability.actions.destroy({ target: this })
                    }
                })
            ]
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Russian and is subject to change."
          ]
        }*/
    }
}

Ransom.id = 'ransom';

module.exports = Ransom;
