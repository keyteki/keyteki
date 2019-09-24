const Card = require('../../Card.js');

class Alaka extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardEntersPlay: (event, context) => {
                    return event.card === context.source && context.player.creatureFought;
                }
            },
            gameAction: ability.actions.ready()
        });
    }
}

Alaka.id = 'alaka';

module.exports = Alaka;
