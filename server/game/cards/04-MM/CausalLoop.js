const Card = require('../../Card.js');

class CausalLoop extends Card {
    // Play: Archive a card. Archive Causal Loop.
    setupCardAbilities(ability) {
        this.play({
            target: {
                location: 'hand',
                controller: 'self',
                gameAction: ability.actions.archive()
            },
            gameAction: ability.actions.archive()
        });
    }
}

CausalLoop.id = 'causal-loop';

module.exports = CausalLoop;
