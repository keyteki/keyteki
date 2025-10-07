import Card from '../../Card.js';

class RadixOfSuffering extends Card {
    // Action: Your opponent loses 1A. If your opponent has no A, draw 1 card.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.loseAmber((context) => ({
                target: context.player.opponent,
                amount: 1
            })),
            then: {
                alwaysTriggers: true,
                condition: (context) => context.player.opponent.amber === 0,
                gameAction: ability.actions.draw()
            }
        });
    }
}

RadixOfSuffering.id = 'radix-of-suffering';

export default RadixOfSuffering;
