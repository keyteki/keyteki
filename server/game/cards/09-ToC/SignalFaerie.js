const Card = require('../../Card.js');

class SignalFaerie extends Card {
    // Play/After Reap: Make a token creature.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            gameAction: ability.actions.makeTokenCreature()
        });
    }
}

SignalFaerie.id = 'signal-faerie';

module.exports = SignalFaerie;
