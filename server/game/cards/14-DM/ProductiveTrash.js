const Card = require('../../Card.js');

class ProductiveTrash extends Card {
    // Play: You may discard a non-Mars card. If you do, a friendly creature captures 1A for each bonus icon on the discarded card.
    setupCardAbilities(ability) {
        this.play({
            preferActionPromptMessage: true,
            target: {
                optional: true,
                location: 'hand',
                controller: 'self',
                cardCondition: (card) => !card.hasHouse('mars'),
                gameAction: ability.actions.discard()
            },
            then: (preThenContext) => {
                if (!preThenContext.target || preThenContext.target.bonusIcons.length === 0) {
                    return { alwaysTriggers: true };
                }

                const captures = new Map();
                const captureAction = ability.actions.capture({
                    promptForSelect: {
                        cardType: 'creature',
                        controller: 'self',
                        onSelect: (_, card) => {
                            captureAction.setTarget(card);
                            captures.set(card, (captures.get(card) || 0) + 1);
                            return true;
                        }
                    }
                });

                return {
                    alwaysTriggers: true,
                    gameAction: ability.actions.sequentialForEach(() => ({
                        num: preThenContext.target.bonusIcons.length,
                        action: captureAction
                    })),
                    then: () => ({
                        alwaysTriggers: true,
                        handler: (thenContext) => {
                            for (const [card, amount] of captures) {
                                thenContext.game.addMessage(
                                    '{0} uses {1} to capture {2} amber on {3}',
                                    thenContext.player,
                                    thenContext.source,
                                    amount,
                                    card
                                );
                            }
                        }
                    })
                };
            }
        });
    }
}

ProductiveTrash.id = 'productive-trash';

module.exports = ProductiveTrash;
