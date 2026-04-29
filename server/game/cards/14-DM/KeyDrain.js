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
                        doForge();
                        return;
                    }

                    context.game.promptForSelect(context.player, {
                        source: context.source,
                        activePromptTitle: 'Choose a card to discard, or click Done',
                        waitingPromptTitle: 'Waiting for opponent',
                        optional: true,
                        location: 'hand',
                        controller: 'self',
                        cardType: ['action', 'creature', 'artifact', 'upgrade'],
                        gameAction: ability.actions.discard(),
                        onSelect: (player, card) => {
                            context.discardCount += 1;
                            ability.actions.discard().resolve(card, context);
                            context.game.queueSimpleStep(() => promptDiscard());
                            return true;
                        },
                        onCancel: () => {
                            context.game.queueSimpleStep(() => doForge());
                            return true;
                        }
                    });
                };

                const doForge = () => {
                    const modifier = 9 - context.discardCount;
                    if (!context.player.canForgeKey(modifier)) {
                        return;
                    }

                    context.game.promptWithHandlerMenu(context.player, {
                        activePromptTitle: 'Forge a key?',
                        source: context.source,
                        choices: ['Yes', 'No'],
                        handlers: [
                            () => {
                                ability.actions
                                    .forgeKey({ modifier })
                                    .resolve(context.player, context);
                            },
                            () => true
                        ]
                    });
                };

                promptDiscard();
            }
        });
    }
}

KeyDrain.id = 'key-drain';

module.exports = KeyDrain;
