const Card = require('../../Card.js');

class Krump extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDamageDealt: (event, context) => event.damageSource === context.source && event.destroyed
            },
            gameAction: ability.actions.loseAmber()
        });
    }
}

Krump.id = 'krump'; // This is a guess at what the id might be - please check it!!!

module.exports = Krump;
