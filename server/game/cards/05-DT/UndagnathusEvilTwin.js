import Card from '../../Card.js';

class UndagnathusEvilTwin extends Card {
    // (T) While the tide is low, double all damage dealt to Undagnathus.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onDamageApplied: (event, context) =>
                    context.source.controller.isTideLow() && event.card === context.source
            },
            effect: 'double the damage dealt to it',
            gameAction: ability.actions.changeEvent((context) => ({
                event: context.event,
                amount: 2 * context.event.amount
            }))
        });
    }
}

UndagnathusEvilTwin.id = 'undagnathus-evil-twin';

export default UndagnathusEvilTwin;
