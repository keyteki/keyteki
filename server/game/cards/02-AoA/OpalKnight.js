import Card from '../../Card.js';

class OpalKnight extends Card {
    // Play: Destroy each creature with even power.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.power % 2 === 0)
            }))
        });
    }
}

OpalKnight.id = 'opal-knight';

export default OpalKnight;
