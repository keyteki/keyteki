const Card = require('../../Card.js');

class ScoopUp extends Card {
    // Play: Put a friendly non-Mars creature and an enemy non-Mars
    // creature into your archives. If either card leaves your
    // archives and you are not the owner of it, put it into its
    // owner’s hand instead.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                friendly: {
                    mode: 'exactly',
                    numCards: 1,
                    cardType: 'creature',
                    controller: 'self',
                    cardCondition: (card) => !card.hasHouse('mars'),
                    gameAction: ability.actions.archive((context) => ({
                        owner: context.targets.friendly
                            ? context.targets.friendly.owner === context.player
                            : false
                    }))
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
