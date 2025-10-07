import Card from '../../Card.js';

class HarbingerOfDoom extends Card {
    // Destroyed: Destroy each creature.
    setupCardAbilities(ability) {
        this.destroyed({
            optional: false,
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card !== this)
            }))
        });
    }
}

HarbingerOfDoom.id = 'harbinger-of-doom';

export default HarbingerOfDoom;
