const Card = require('../../Card.js');

class GolisArtificer extends Card {
    // After Reap: Make a token creature.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.makeTokenCreature()
        });
    }
}

GolisArtificer.id = 'golis-artificer';

module.exports = GolisArtificer;
