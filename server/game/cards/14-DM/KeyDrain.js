const Card = require('../../Card.js');

class KeyDrain extends Card {
    // Play: You may discard any number of cards from your hand. Forge a key at +9A current
    // cost, reduced by 1 for each card discarded this way.
    setupCardAbilities(ability) {
        this.play({
            effect: 'forge a key, reduced by 1A for each card discarded',
            handler: (context) => {
                context.discardCount = 0;

                const promptDiscard = () => {
                    if (context.player.hand.length === 0) {
                        forge();
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
                            context.game.queueSimpleStep(() => forge());
                            return true;
                        }
                    });
                };

                const forge = () => {
                    const modifier = 9 - context.discardCount;
                    ability.actions.forgeKey({ modifier }).resolve(context.player, context);
                };

                promptDiscard();
            }
        });
    }
}

KeyDrain.id = 'key-drain';

module.exports = KeyDrain;
