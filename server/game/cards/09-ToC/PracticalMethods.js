const Card = require('../../Card.js');

class PracticalMethods extends Card {
    // Play: Make a token creature. Destroy a friendly creature and an
    // enemy creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature(),
            then: {
                alwaysTriggers: true,
                targets: {
                    friendly: {
                        mode: 'exactly',
                        numCards: 1,
                        cardType: 'creature',
                        controller: 'self',
                        gameAction: ability.actions.destroy()
                    },
                    enemy: {
                        mode: 'exactly',
                        numCards: 1,
                        cardType: 'creature',
                        controller: 'opponent',
                        gameAction: ability.actions.destroy()
                    }
                },
                message: '{0} uses {1} to destroy {3}',
                messageArgs: (context) => [Object.values(context.targets)]
            }
        });
    }
}

PracticalMethods.id = 'practical-methods';

module.exports = PracticalMethods;
