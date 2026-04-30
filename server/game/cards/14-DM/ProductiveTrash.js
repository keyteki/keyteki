const Card = require('../../Card.js');

class ProductiveTrash extends Card {
    // Play: You may discard a non-Mars card. If you do, a friendly creature captures 1A for each bonus icon on the discarded card.
    setupCardAbilities(ability) {
        this.play({
            effect: 'discard a non-Mars card and capture amber for each bonus icon',
            handler: (context) => {
                const promptCapture = (remaining) => {
                    if (remaining <= 0) {
                        return;
                    }
                    context.game.promptForSelect(context.player, {
                        source: context.source,
                        cardType: 'creature',
                        controller: 'self',
                        gameAction: ability.actions.capture({ amount: 1 }),
                        onSelect: (_, card) => {
                            ability.actions.capture({ amount: 1 }).resolve(card, context);
                            context.game.queueSimpleStep(() => promptCapture(remaining - 1));
                            return true;
                        }
                    });
                };

                context.game.promptForSelect(context.player, {
                    source: context.source,
                    optional: true,
                    location: 'hand',
                    controller: 'self',
                    cardCondition: (card) => !card.hasHouse('mars'),
                    gameAction: ability.actions.discard(),
                    onSelect: (_, card) => {
                        const total = card.bonusIcons.length;
                        ability.actions.discard().resolve(card, context);
                        context.game.queueSimpleStep(() => promptCapture(total));
                        return true;
                    },
                    onCancel: () => true
                });
            }
        });
    }
}

ProductiveTrash.id = 'productive-trash';

module.exports = ProductiveTrash;
