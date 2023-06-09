const Card = require('../../Card.js');

class MaruckTheMarked extends Card {
    // After Maruck the Marked prevents damage with its armor, capture 1A for each damage just prevented.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDamagePreventedByArmor: (event, context) => event.card === context.source
            },
            gameAction: ability.actions.capture((context) => ({
                amount: context.event.armorUsed
            }))
        });
    }
}

MaruckTheMarked.id = 'maruck-the-marked';

module.exports = MaruckTheMarked;
