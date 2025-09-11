const Card = require('../../Card.js');

class Havoc extends Card {
    // Play: Make a token creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature()
        });
    }
}

Havoc.id = 'havoc';

module.exports = Havoc;
