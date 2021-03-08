const Card = require('../../Card.js');

class Ch337a extends Card {
    //Elusive.
    //While the tide is high, each of $this's neighbors gains elusive.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        //Keywords: elusive
        this.persistentEffect({
            targetController: 'any',
            condition: (context) => context.player.isTideHigh(),
            match: (card, context) =>
                card.type === 'creature' && context.source.neighbors.includes(card),
            effect: ability.effects.addKeyword({
                elusive: 1
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

Ch337a.id = 'ch-337a';

module.exports = Ch337a;
