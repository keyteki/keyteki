const Card = require('../../Card.js');

class ScoopUp extends Card {
    // Play: Put a friendly non-Mars creature and an enemy non-Mars
    // creature into your archives. If that enemy creature would leave
    // your archives, return it to its owner's hand instead.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                friendly: {
                    mode: 'exactly',
                    numCards: 1,
                    cardType: 'creature',
                    controller: 'self',
                    cardCondition: (card) => !card.hasHouse('mars'),
                    gameAction: ability.actions.archive()
                },
                enemy: {
                    mode: 'exactly',
                    numCards: 1,
                    cardType: 'creature',
                    controller: 'opponent',
                    cardCondition: (card) => !card.hasHouse('mars'),
                    gameAction: ability.actions.archive({
                        owner: false
                    })
                }
            },
            effect: 'archive {1}',
            effectArgs: (context) => [Object.values(context.targets)]
        });
    }
}

ScoopUp.id = 'scoop-up';

module.exports = ScoopUp;
