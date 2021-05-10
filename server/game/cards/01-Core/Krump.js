const Card = require('../../Card.js');

class Krump extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.destroyedFighting && event.damageEvent.damageSource === context.source
            },
            gameAction: ability.actions.loseAmber()
        });
    }
}

Krump.id = 'krump';

module.exports = Krump;
