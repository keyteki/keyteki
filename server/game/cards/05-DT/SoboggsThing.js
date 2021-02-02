const Card = require('../../Card.js');

class SoboggsThing extends Card {
    // After your opponent forges a key, exhaust each creature they control.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onForgeKey: (event, context) => event.player !== context.player
            },
            gameAction: ability.actions.exhaust((context) => ({
                target: context.player.opponent.creaturesInPlay
            }))
        });
    }
}

SoboggsThing.id = 'sobogg-s-thing-';

module.exports = SoboggsThing;
