const Card = require('../../Card.js');

class BrainEater extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDamageDealt: (event, context) => event.damageSource === context.source && event.destroyed
            },
            gameAction: ability.actions.draw()
        });
    }
}

BrainEater.id = 'brain-eater'; // This is a guess at what the id might be - please check it!!!

module.exports = BrainEater;
