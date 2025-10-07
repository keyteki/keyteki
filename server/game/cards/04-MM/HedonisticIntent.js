import Card from '../../Card.js';

class HedonisticIntent extends Card {
    // Play: Exalt each flank creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.exalt((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.isOnFlank())
            }))
        });
    }
}

HedonisticIntent.id = 'hedonistic-intent';

export default HedonisticIntent;
