import Card from '../../Card.js';

class RecoveryOperation extends Card {
    // Play: Discard the bottom 3 cards of your deck. You may put any number of the discarded cards on top of your deck in any order.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discard((context) => ({
                target: context.player.deck.slice(-3)
            })),
            then: {
                gameAction: ability.actions.sequentialForEach((context) => ({
                    num: context.preThenEvents.filter((e) => !!e.card).length,
                    action: ability.actions.returnToDeck({
                        promptForSelect: {
                            activePromptTitle: 'Choose a card to put on top of your deck',
                            controller: 'self',
                            location: 'discard',
                            optional: true,
                            cardCondition: (card) =>
                                context.preThenEvents
                                    .filter((e) => !!e.card && e.card.location === 'discard')
                                    .map((e) => e.card)
                                    .includes(card),
                            message: '{0} uses {1} to put {2} on top of their deck',
                            messageArgs: (cards) => [context.player, context.source, cards]
                        }
                    })
                }))
            }
        });
    }
}

RecoveryOperation.id = 'recovery-operation';

export default RecoveryOperation;
