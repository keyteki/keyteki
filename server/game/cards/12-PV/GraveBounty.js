import Card from '../../Card.js';

class GraveBounty extends Card {
    // Play: Purge a card from your discard pile. If you do, your opponent loses 2.
    // Fate: Purge the top 2 cards of your discard pile.
    setupCardAbilities(ability) {
        this.play({
            target: {
                location: 'discard',
                controller: 'self',
                gameAction: ability.actions.purge()
            },
            then: {
                condition: (context) => context.player.opponent,
                gameAction: ability.actions.loseAmber((context) => ({
                    target: context.player.opponent,
                    amount: 2
                })),
                message: '{0} uses {1} to make {3} lose 2 amber',
                messageArgs: (context) => [context.player.opponent]
            }
        });

        this.fate({
            gameAction: ability.actions.purge((context) => ({
                target: context.game.activePlayer.discard.slice(0, 2)
            }))
        });
    }
}

GraveBounty.id = 'grave-bounty';

export default GraveBounty;
