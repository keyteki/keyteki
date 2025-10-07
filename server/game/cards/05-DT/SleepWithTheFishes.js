import Card from '../../Card.js';

class SleepWithTheFishes extends Card {
    // Play: Destroy each exhausted creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.exhausted)
            }))
        });
    }
}

SleepWithTheFishes.id = 'sleep-with-the-fishes';

export default SleepWithTheFishes;
