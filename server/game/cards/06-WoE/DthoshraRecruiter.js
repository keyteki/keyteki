const Card = require('../../Card.js');

class DthoshraRecruiter extends Card {
    // After Reap: Make a token creature.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.makeTokenCreature()
        });
    }
}

DthoshraRecruiter.id = 'dthoshră-recruiter';

module.exports = DthoshraRecruiter;
