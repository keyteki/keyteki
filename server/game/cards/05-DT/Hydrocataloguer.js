const Card = require('../../Card.js');

class Hydrocataloguer extends Card {
    //After a player raises the tide, they archive the top card of their deck.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onRaiseTide: () => true
            },
            gameAction: ability.actions.archive((context) => ({
                target: context.event.player.deck.slice(
                    0,
                    Math.min(context.event.player.deck.length, 1)
                ),
                location: 'deck'
            }))
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Chinese and is subject to change."
          ]
        }*/
    }
}

Hydrocataloguer.id = 'hydrocataloguer';

module.exports = Hydrocataloguer;
