
const Card = require('../../Card.js');

class TheGrimReaper extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardEntersPlay: (event, context) => {
                    return event.card === context.source && context.player.isHaunted();
                }
            },
            gameAction: ability.actions.ready()
        });
    }
}

TheGrimReaper.id = 'the-grim-reaper';

module.exports = TheGrimReaper;
