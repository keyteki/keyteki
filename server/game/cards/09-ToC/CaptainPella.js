const Card = require('../../Card.js');

class CaptainPella extends Card {
    // After Reap: Make a token creature.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.makeTokenCreature()
        });
    }
}

CaptainPella.id = 'captain-pella';

module.exports = CaptainPella;
