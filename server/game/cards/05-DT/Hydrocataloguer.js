const Card = require('../../Card.js');

class Hydrocataloguer extends Card {
    //After a player raises the tide, they archive the top card of their deck.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onRaiseTide: () => true
            },
            gameAction: ability.actions.archive((context) => ({
                target: context.event.player.deck[0],
                location: 'deck'
            }))
        });
    }
}

Hydrocataloguer.id = 'hydrocataloguer';

module.exports = Hydrocataloguer;
