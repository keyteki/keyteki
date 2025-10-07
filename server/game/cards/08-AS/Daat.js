import Card from '../../Card.js';

class Daat extends Card {
    // Play: Choose a house. That house becomes the active house.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'house'
            },
            effect: 'make {1} their active house',
            effectArgs: (context) => [context.house],
            gameAction: ability.actions.changeActiveHouse((context) => ({
                house: context.house
            }))
        });
    }
}

Daat.id = 'daat';

export default Daat;
