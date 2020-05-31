const Card = require('../../Card.js');

class GhostlyHand extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.opponent && context.player.opponent.amber === 1,
            gameAction: ability.actions.steal()
        });
    }
}

GhostlyHand.id = 'ghostly-hand';

module.exports = GhostlyHand;
