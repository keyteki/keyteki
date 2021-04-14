const Card = require('../../Card.js');

class Almsmaster extends Card {
    // Deploy. Taunt.
    // Play: Each of Almsmaster's neighbors captures 1A.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture((context) => ({
                target: context.source.neighbors
            }))
        });
    }
}

Almsmaster.id = 'almsmaster';

module.exports = Almsmaster;
