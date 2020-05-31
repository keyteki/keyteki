const Card = require('../../Card.js');

class MaruckTheMarked extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDamagePreventedByArmor: (event, context) => event.card === context.source
            },
            gameAction: ability.actions.capture((context) => ({
                amount: context.event.damagePrevented
            }))
        });
    }
}

MaruckTheMarked.id = 'maruck-the-marked';

module.exports = MaruckTheMarked;
