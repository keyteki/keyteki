import Card from '../../Card.js';

class BornToRock extends Card {
    // Each friendly Brobnar creature gets +1 power for each of its Brobnar neighbors.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            match: (card) => card.hasHouse('brobnar'),
            effect: ability.effects.modifyPower(
                (card) => card.neighbors.filter((neighbor) => neighbor.hasHouse('brobnar')).length
            )
        });
    }
}

BornToRock.id = 'born-to-rock';

export default BornToRock;
