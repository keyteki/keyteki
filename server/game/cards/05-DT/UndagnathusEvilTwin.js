const Card = require('../../Card.js');

class UndagnathusEvilTwin extends Card {
    // While the tide is low, double all damage dealt to Undagnathus.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onDamageDealt: (event, context) =>
                    context.source.controller.isTideLow() &&
                    event.card === context.source &&
                    event.amount > ((!event.ignoreArmor && event.card.tokens.armor) || 0)
            },
            effect: 'double the damage dealt to it',
            gameAction: ability.actions.changeEvent((context) => ({
                event: context.event,
                amount:
                    2 * context.event.amount -
                    ((!context.event.ignoreArmor && context.event.card.tokens.armor) || 0)
            }))
        });
    }
}

UndagnathusEvilTwin.id = 'undagnathus-evil-twin';

module.exports = UndagnathusEvilTwin;
