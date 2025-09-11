const Card = require('../../Card.js');

class DemonicShelf extends Card {
    // Action: Put a friendly creature faceup under Demonic
    // Shelf. Deal 3D to a creature for each card under Demonic Shelf.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.placeUnder((context) => ({
                    parent: context.source
                }))
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.allocateDamage((context) => ({
                    damageStep: 3,
                    numSteps: context.source.childCards.length
                })),
                message: '{0} uses {1} to deal 3 damage to a creature for each card under {1}'
            }
        });
    }
}

DemonicShelf.id = 'demonic-shelf';

module.exports = DemonicShelf;
