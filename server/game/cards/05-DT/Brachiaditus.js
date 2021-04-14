const Card = require('../../Card.js');

class Brachiaditus extends Card {
    //Deploy.
    //Play: Stun each neighboring creature. Move 1A from each of those creatures to the common supply.
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.stun((context) => ({
                    target: context.source.neighbors
                })),
                ability.actions.removeAmber((context) => ({
                    target: context.source.neighbors,
                    amount: 1
                }))
            ]
        });
    }
}

Brachiaditus.id = 'brachiaditus';

module.exports = Brachiaditus;
