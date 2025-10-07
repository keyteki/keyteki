import Card from '../../Card.js';

class CrushingCharge extends Card {
    // Play: Destroy each creature with power 4 or lower. Gain 1 chain.
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.destroy((context) => ({
                    target: context.game.creaturesInPlay.filter((card) => card.power <= 4)
                })),
                ability.actions.gainChains()
            ],
            effect: 'destroy each creature with power 4 or lower and gain 1 chain'
        });
    }
}

CrushingCharge.id = 'crushing-charge';

export default CrushingCharge;
