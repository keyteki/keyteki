const Card = require('../../Card.js');

class CobaltKapulet extends Card {
    // Reap: After Reap: Capture 2A for each of Cobalt Kapulet’s Mars neighbors.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.capture((context) => ({
                amount: 2 * context.source.neighbors.filter((c) => c.hasHouse('mars')).length
            }))
        });
    }
}

CobaltKapulet.id = 'cobalt-kapulet';

module.exports = CobaltKapulet;
