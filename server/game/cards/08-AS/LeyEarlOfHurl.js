import Card from '../../Card.js';

class LeyEarlOfHurl extends Card {
    // Destroyed: If Ley, Earl of Hurl is not on a flank, fully heal
    // it, exhaust it, ward it, and move it to a flank instead.
    setupCardAbilities(ability) {
        this.destroyed({
            condition: (context) => !context.source.isOnFlank(),
            effect: 'heal all damage from {0}, exhaust it, ward it and move it to a flank',
            effectArgs: () => this,
            gameAction: [
                ability.actions.heal({ fully: true }),
                ability.actions.exhaust(),
                ability.actions.ward(),
                ability.actions.moveToFlank(),
                ability.actions.changeEvent((context) => ({
                    event: context.event,
                    cancel: true,
                    postHandler: (context) => (context.source.moribund = false)
                })),
                ability.actions.changeEvent((context) => ({
                    event: context.event.triggeringEvent,
                    cancel: true
                }))
            ]
        });
    }
}

LeyEarlOfHurl.id = 'ley-earl-of-hurl';

export default LeyEarlOfHurl;
