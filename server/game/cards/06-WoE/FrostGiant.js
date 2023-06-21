const Card = require('../../Card.js');

class FrostGiant extends Card {
    // Frost Giant does not ready during your ready cards step.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.doesNotReady()
        });
    }
}

FrostGiant.id = 'frost-giant';

module.exports = FrostGiant;
