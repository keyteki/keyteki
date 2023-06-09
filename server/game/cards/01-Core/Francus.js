const Card = require('../../Card.js');

class Francus extends Card {
    // After an enemy creature is destroyed fighting Francus, Francus captures 1<A>.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.destroyedFighting && event.damageEvent.damageSource === context.source
            },
            gameAction: ability.actions.capture()
        });
    }
}

Francus.id = 'francus';

module.exports = Francus;
