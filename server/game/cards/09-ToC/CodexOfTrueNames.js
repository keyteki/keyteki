import Card from '../../Card.js';

class CodexOfTrueNames extends Card {
    // Action: Destroy Codex of True Names. If you do, return each
    // friendly Catena Fiend to its owner’s hand. For each card
    // returned this way, return an enemy creature to its owner’s
    // hand.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.destroy(),
            then: {
                message: '{0} uses {1} to return each friendly Catena Fiend to their hand',
                gameAction: ability.actions.returnToHand((context) => ({
                    target: context.player.creaturesInPlay.filter((c) => c.name === 'Catena Fiend')
                })),
                then: {
                    alwaysTriggers: true,
                    gameAction: ability.actions.sequentialForEach((context) => ({
                        num: context.preThenEvents.filter((event) => !event.cancelled).length,
                        action: ability.actions.returnToHand({
                            promptForSelect: {
                                activePromptTitle: 'Choose a creature to return to hand',
                                cardType: 'creature',
                                controller: 'opponent',
                                message: "{0} uses {1} to return {2} to {3}'s hand",
                                messageArgs: (card) => [
                                    context.player,
                                    context.source,
                                    card,
                                    card.owner
                                ]
                            }
                        })
                    }))
                }
            }
        });
    }
}

CodexOfTrueNames.id = 'codex-of-true-names';

export default CodexOfTrueNames;
