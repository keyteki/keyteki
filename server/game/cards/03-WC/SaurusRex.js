const Card = require('../../Card.js');

class SaurusRex extends Card {
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            condition: context => context.source.isInCenter(),
            optional: true,
            gameAction: ability.actions.exalt(),
            then: {
                gameAction: ability.actions.search({
                    cardCondition: card => card.hasHouse('saurian'),
                    location: ['deck'],
                    amount: 1
                })
            }
        });
    }
}

SaurusRex.id = 'saurus-rex';

module.exports = SaurusRex;
