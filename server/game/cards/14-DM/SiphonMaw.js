const Card = require('../../Card.js');

class SiphonMaw extends Card {
    // After Fight/After Reap: Discard the top card of a player's deck. For each bonus icon on the discarded card, your opponent loses 1A.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            target: {
                mode: 'select',
                choices: {
                    Mine: () => true,
                    Opponent: (context) => !!context.player.opponent
                }
            },
            effect: 'discard the top card of {1}',
            effectArgs: (context) =>
                context.select === 'Mine' ? 'their deck' : "their opponent's deck",
            gameAction: ability.actions.discard((context) => {
                const owner = context.select === 'Mine' ? context.player : context.player.opponent;
                return {
                    location: 'deck',
                    target: owner && owner.deck[0] ? [owner.deck[0]] : []
                };
            }),
            then: () => {
                const amberLost = (context) =>
                    context.preThenEvents
                        .filter((event) => !event.cancelled && event.card)
                        .reduce(
                            (sum, event) =>
                                sum + (event.card.bonusIcons ? event.card.bonusIcons.length : 0),
                            0
                        );
                return {
                    alwaysTriggers: true,
                    condition: (context) => amberLost(context) > 0,
                    message: '{0} uses {1} to make {3} lose {4} amber',
                    messageArgs: (context) => [context.player.opponent, amberLost(context)],
                    gameAction: ability.actions.loseAmber((context) => ({
                        amount: amberLost(context)
                    }))
                };
            }
        });
    }
}

SiphonMaw.id = 'siphon-maw';

module.exports = SiphonMaw;
