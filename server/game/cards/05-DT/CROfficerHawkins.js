const Card = require('../../Card.js');

class CROfficerHawkins extends Card {
    // Deploy.
    // Play: Gain 1 for each of C.R. Officer Hawkins' non-Star Alliance neighbor.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.gainAmber((context) => ({
                amount: context.source.neighbors.filter((c) => !c.hasHouse('staralliance')).length
            }))
        });
    }
}

CROfficerHawkins.id = 'cr-officer-hawkins';

module.exports = CROfficerHawkins;
