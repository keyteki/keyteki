const Card = require('../../Card.js');

class LeyEarlOfHurl extends Card {
    // Destroyed: If Ley, Earl of Hurl is not on a flank, fully heal
    // it, exhaust it, ward it, and move it to a flank instead.
    setupCardAbilities() {
        this.destroyed({
            condition: (context) => !context.source.isOnFlank(),
            effect: 'replace its destruction',
            handler: (context) => {
                context.event.replacementHandler = (leavesPlayEvent) => {
                    const card = leavesPlayEvent.card;
                    context.game.addMessage(
                        '{0} uses {1} to fully heal it, exhaust it, ward it, and move it to a flank',
                        context.player,
                        context.source
                    );
                    context.game.actions
                        .sequential([
                            context.game.actions.heal({ fully: true }),
                            context.game.actions.exhaust(),
                            context.game.actions.ward(),
                            context.game.actions.moveToFlank()
                        ])
                        .resolve(card, context);
                };
            }
        });
    }
}

LeyEarlOfHurl.id = 'ley-earl-of-hurl';

module.exports = LeyEarlOfHurl;
