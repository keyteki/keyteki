const Card = require('../../Card.js');

class CROfficerHawkins extends Card {
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
