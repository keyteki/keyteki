const Card = require('../../Card.js');

class BrainEater extends Card {
    // After a creature is destroyed fighting Brain Eater, draw a card.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.destroyedFighting && event.damageEvent.damageSource === context.source
            },
            gameAction: ability.actions.draw()
        });
    }
}

BrainEater.id = 'brain-eater';

module.exports = BrainEater;
