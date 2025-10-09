const Card = require('../../Card.js');

class StormSurge extends Card {
    // Play: Your opponent cannot ready cards during the "ready cards" step of their next turn.
    setupCardAbilities(ability) {
        this.play({
            effect:
                'prevent opponent from readying cards during the ready card step of their next turn',
            effectAlert: true,
            gameAction: ability.actions.untilEndOfOpponentsNextTurn({
                targetController: 'opponent',
                effect: ability.effects.doesNotReady()
            })
        });
    }
}

StormSurge.id = 'storm-surge';

module.exports = StormSurge;
