const Card = require('../../Card.js');

class Science extends Card {
    //Play: For the remainder of the turn, gain 1A each time you play an action card.
    //This card has been translated from Polish and is subject to change.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.forRemainderOfTurn({
                when: {
                    onCardPlayed: (event, context) =>
                        event.player === context.player && event.card.type === 'action'
                },
                gameAction: ability.actions.gainAmber({ amount: 1 })
            })
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Polish and is subject to change."
          ]
        }*/
    }
}

Science.id = 'science';

module.exports = Science;
