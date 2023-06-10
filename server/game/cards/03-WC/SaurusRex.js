const Card = require('../../Card.js');

class SaurusRex extends Card {
    // Fight/Reap: If Saurus Rex is in the center of your battleline, you may exalt it. If you do, search your deck for a Saurian card, reveal it, and put it into your hand. Shuffle your deck.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            condition: (context) => context.source.isInCenter(),
            optional: true,
            gameAction: ability.actions.exalt(),
            then: {
                gameAction: ability.actions.search({
                    cardCondition: (card) => card.hasHouse('saurian'),
                    location: ['deck'],
                    amount: 1
                })
            }
        });
    }
}

SaurusRex.id = 'saurus-rex';

module.exports = SaurusRex;
