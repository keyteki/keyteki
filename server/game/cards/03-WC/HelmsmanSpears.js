const Card = require('../../Card.js');

class HelmsmanSpears extends Card {
    // Fight/Reap: Discard any number of cards from your hand. Draw a card for each card discarded this way.
    setupCardAbilities(ability) {
        const discardThenDraw = (context) => {
            context.discardCount = 0;

            const promptDiscard = () => {
                if (context.player.hand.length === 0) {
                    draw();
                    return;
                }

                context.game.promptForSelect(context.player, {
                    source: context.source,
                    optional: true,
                    location: 'hand',
                    controller: 'self',
                    gameAction: ability.actions.discard(),
                    onSelect: (_, card) => {
                        context.discardCount += 1;
                        ability.actions.discard().resolve(card, context);
                        context.game.queueSimpleStep(() => promptDiscard());
                        return true;
                    },
                    onCancel: () => {
                        context.game.queueSimpleStep(() => draw());
                        return true;
                    }
                });
            };

            const draw = () => {
                context.game.addMessage(
                    '{0} uses {1} to discard {2} card{3} and draw {2} card{3}',
                    context.player,
                    context.source,
                    context.discardCount,
                    context.discardCount === 1 ? '' : 's'
                );
                ability.actions
                    .draw({ amount: context.discardCount })
                    .resolve(context.player, context);
            };

            promptDiscard();
        };

        this.fight({
            reap: true,
            effect: 'discard any number of cards from their hand and draw a card for each',
            preferActionPromptMessage: true,
            handler: discardThenDraw
        });
    }
}

HelmsmanSpears.id = 'helmsman-spears';

module.exports = HelmsmanSpears;
