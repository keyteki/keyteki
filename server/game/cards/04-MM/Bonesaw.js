const Card = require('../../Card.js');

class Bonesaw extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardEntersPlay: (event, context) => {
                    return event.card === context.source && context.player.creatureDestroyed;
                }
            },
            gameAction: ability.actions.ready()
        });
    }
}

Bonesaw.id = 'bonesaw';

module.exports = Bonesaw;
