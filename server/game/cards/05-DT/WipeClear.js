import Card from '../../Card.js';

class WipeClear extends Card {
    // Play: Deal 1D to each creature. Destroy each upgrade.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.sequential([
                ability.actions.dealDamage((context) => ({
                    target: context.game.creaturesInPlay
                })),
                ability.actions.destroy((context) => ({
                    target: context.game.creaturesInPlay.flatMap((card) => card.upgrades || [])
                }))
            ]),
            effect: 'deal 1D to each creature and destroy each upgrade'
        });
    }
}

WipeClear.id = 'wipe-clear';

export default WipeClear;
