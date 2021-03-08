const Card = require('../../Card.js');

class AbyssalPriest extends Card {
    //After you play an Aquan creature, exhaust an enemy creature.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.player === context.player &&
                    event.card.type === 'creature' &&
                    event.card.hasTrait('aquan')
            },
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.exhaust()
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

AbyssalPriest.id = 'abyssal-priest-';

module.exports = AbyssalPriest;
