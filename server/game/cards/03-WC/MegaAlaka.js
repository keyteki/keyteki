const Card = require('../../Card.js');

class MegaAlaka extends Card {
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

MegaAlaka.id = 'mega-alaka';

module.exports = MegaAlaka;
