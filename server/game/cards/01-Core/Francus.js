const Card = require('../../Card.js');

class Francus extends Card {
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
