const Card = require('../../Card.js');

class CheloniaEvilTwin extends Card {
    //Elusive.
    //After you play another creature, if the tide is high, your opponent loses 1A.
    //This card is translated from Portuguese and is subject to change.
    setupCardAbilities(ability) {
        //Keywords: elusive
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.player === context.player &&
                    event.card.type === 'creature' &&
                    event.card !== context.source
            },
            condition: (context) => context.player.isTideHigh(),
            gameAction: ability.actions.loseAmber({ amount: 1 })
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card is translated from Portuguese and is subject to change."
          ]
        }*/
    }
}

CheloniaEvilTwin.id = 'chelonia-evil-twin';

module.exports = CheloniaEvilTwin;
