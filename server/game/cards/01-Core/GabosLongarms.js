const Card = require('../../Card.js');

class GabosLongarms extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onFight: (event, context) => event.attacker === context.source
            },
            target: {
                cardType: 'creature', //TODO
            }
        });
    }
}

GabosLongarms.id = 'gabos-longarms'; // This is a guess at what the id might be - please check it!!!

module.exports = GabosLongarms;
