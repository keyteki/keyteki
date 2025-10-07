import Card from '../../Card.js';

class CoverFire extends Card {
    // Play: Your opponent loses half of their A (rounding down). Steal 1A.
    setupCardAbilities(ability) {
        this.play({
            effect: 'make {1} lose half their amber and steal 1 amber',
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.sequential([
                ability.actions.loseAmber((context) => ({
                    target: context.player.opponent,
                    amount: Math.floor(context.player.opponent.amber / 2)
                })),
                ability.actions.steal()
            ])
        });
    }
}

CoverFire.id = 'cover-fire';

export default CoverFire;
