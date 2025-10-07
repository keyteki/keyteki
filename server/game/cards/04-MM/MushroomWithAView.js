import Card from '../../Card.js';

class MushroomWithAView extends Card {
    // Omni: Heal 1 damage from each friendly creature.
    setupCardAbilities(ability) {
        this.omni({
            gameAction: ability.actions.heal((context) => ({
                amount: 1,
                target: context.player.creaturesInPlay
            }))
        });
    }
}

MushroomWithAView.id = 'mushroom-with-a-view';

export default MushroomWithAView;
