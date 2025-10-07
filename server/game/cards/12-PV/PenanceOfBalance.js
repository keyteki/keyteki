import Card from '../../Card.js';

function getDifference(context) {
    const enemyCreatures = context.player.opponent.creaturesInPlay.length;
    const opponentAmber = context.player.opponent.amber;
    return enemyCreatures - opponentAmber;
}

class PenanceOfBalance extends Card {
    // Play: If there are more enemy creatures than amber in your opponent's pool, X is equal to the difference. Choose one:
    // Destroy X enemy creatures.
    // Your opponent loses X amber.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => {
                if (!context.player.opponent) {
                    return false;
                }
                return getDifference(context) > 0;
            },
            target: {
                mode: 'select',
                choices: {
                    'Destroy enemy creatures': ability.actions.destroy((context) => {
                        const difference = getDifference(context);
                        return {
                            promptForSelect: {
                                activePromptTitle: 'Choose creatures to destroy',
                                cardType: 'creature',
                                controller: 'opponent',
                                numCards: difference,
                                message: '{0} uses {1} to destroy {2}',
                                messageArgs: (cards) => [context.player, this, cards]
                            },
                            effectMsg: 'destroy {1} enemy creatures',
                            effectArgs: () => difference
                        };
                    }),
                    'Opponent loses amber': ability.actions.loseAmber((context) => {
                        const difference = getDifference(context);
                        return {
                            target: context.player.opponent,
                            amount: difference
                        };
                    })
                }
            }
        });
    }
}

PenanceOfBalance.id = 'penance-of-balance';

export default PenanceOfBalance;
