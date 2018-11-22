const Card = require('../../Card.js');

class Francus extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDamageDealt: (event, context) => event.damageSource === context.source && event.destroyed
            },
            gameAction: ability.actions.capture()
        });
    }
}

Francus.id = 'francus'; // This is a guess at what the id might be - please check it!!!

module.exports = Francus;
