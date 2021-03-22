const Card = require('../../Card.js');

class CROfficerHawkinsEvilTwin extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.loseAmber((context) => ({
                amount: context.source.neighbors.filter((c) => !c.hasHouse('staralliance')).length
            }))
        });
    }
}

CROfficerHawkinsEvilTwin.id = 'cr-officer-hawkins-evil-twin';

module.exports = CROfficerHawkinsEvilTwin;
