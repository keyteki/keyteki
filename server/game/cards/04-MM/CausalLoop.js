const Card = require('../../Card.js');

class CausalLoop extends Card {
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
