const Card = require('../../Card.js');

class DefendTheKeyraken extends Card {
    // Play: Ward a friendly Keyraken creature and each of its neighbors.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => card.hasHouse('keyraken'),
                gameAction: ability.actions.ward()
            },
            then: {
                gameAction: ability.actions.ward((context) => ({
                    target: context.preThenEvent.card.neighbors
                }))
            }
        });
    }
}

DefendTheKeyraken.id = 'defend-the-keyraken';

module.exports = DefendTheKeyraken;
