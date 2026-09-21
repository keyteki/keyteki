const Card = require('../../Card.js');

class LeyEarlOfHurl extends Card {
    // Destroyed: If Ley, Earl of Hurl is not on a flank, fully heal
    // it, exhaust it, ward it, and move it to a flank instead.
    setupCardAbilities() {
        this.destroyed({
            condition: (context) => !context.source.isOnFlank(),
            handler: (context) => {
                context.event.replacementHandler = (leavesPlayEvent) => {
                    const card = leavesPlayEvent.card;
                    card.moribund = false;
                    card.removeToken('damage');
                    card.exhausted = true;
                    card.ward();
                    context.game.addMessage(
                        '{0} uses {1} to fully heal it, exhaust it, ward it, and move it to a flank',
                        context.player,
                        context.source
                    );
                    context.game.actions.moveToFlank().resolve(card, context);
                };
            }
        });
    }
}

LeyEarlOfHurl.id = 'ley-earl-of-hurl';

module.exports = LeyEarlOfHurl;
