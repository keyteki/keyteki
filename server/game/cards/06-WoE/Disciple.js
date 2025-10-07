import Card from '../../Card.js';

class Disciple extends Card {
    // Disciple gets +1 power and +1 armor for each Monk neighbor it has
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [
                ability.effects.modifyArmor(
                    (card) => card.neighbors.filter((c) => c.hasTrait('monk')).length
                ),
                ability.effects.modifyPower(
                    (card) => card.neighbors.filter((c) => c.hasTrait('monk')).length
                )
            ]
        });
    }
}

Disciple.id = 'disciple';

export default Disciple;
