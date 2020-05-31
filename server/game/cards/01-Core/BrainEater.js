const Card = require('../../Card.js');

class BrainEater extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDamageDealt: (event, context) =>
                    event.damageSource === context.source &&
                    event.destroyEvent &&
                    event.destroyEvent.resolved
            },
            gameAction: ability.actions.draw()
        });
    }
}

BrainEater.id = 'brain-eater';

module.exports = BrainEater;
