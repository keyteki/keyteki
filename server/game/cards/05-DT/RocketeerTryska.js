const Card = require('../../Card.js');

class RocketeerTryska extends Card {
    //If the tide is high, $this's neighbors enter play ready.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: (context) => context.player.isTideHigh(),
            match: (card, context) =>
                card.type === 'creature' && context.source.neighbors.includes(card),
            effect: ability.effects.entersPlayReady()
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Chinese and is subject to change."
          ]
        }*/
    }
}

RocketeerTryska.id = 'rocketeer-tryska';

module.exports = RocketeerTryska;
