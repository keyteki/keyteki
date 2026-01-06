const Card = require('../../Card.js');

class BeastOfDarkLegend extends Card {
    // Play: Play a friendly Keyraken creature from a purged zone. Ready a friendly Keyraken creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                optional: true,
                location: 'purged',
                controller: 'self',
                cardType: 'creature',
                cardCondition: (card) => card.hasHouse('keyraken'),
                gameAction: ability.actions.playCard()
            },
            then: {
                alwaysTriggers: true,
                target: {
                    cardType: 'creature',
                    controller: 'self',
                    cardCondition: (card) => card.hasHouse('keyraken'),
                    gameAction: ability.actions.ready()
                }
            }
        });
    }
}

BeastOfDarkLegend.id = 'beast-of-dark-legend';

module.exports = BeastOfDarkLegend;
