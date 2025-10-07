import Card from '../../Card.js';

class CowardsEnd extends Card {
    // Play: Destroy each undamaged creature. Gain 3chains.
    setupCardAbilities(ability) {
        this.play({
            effect: 'destroy each undamaged creature',
            gameAction: [
                ability.actions.gainChains({ amount: 3 }),
                ability.actions.destroy((context) => ({
                    target: context.game.creaturesInPlay.filter((card) => !card.hasToken('damage'))
                }))
            ]
        });
    }
}

CowardsEnd.id = 'coward-s-end';

export default CowardsEnd;
