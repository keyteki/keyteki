import Card from '../../Card.js';

class PersistenceHunting extends Card {
    // Play: Choose a house. Exhaust each enemy creature of the chosen house.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'house'
            },
            gameAction: ability.actions.exhaust((context) => ({
                target: context.game.creaturesInPlay.filter(
                    (card) => card.controller !== context.player && card.hasHouse(context.house)
                )
            }))
        });
    }
}

PersistenceHunting.id = 'persistence-hunting';

export default PersistenceHunting;
