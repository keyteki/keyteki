const Card = require('../../Card.js');

class BrobnarPlant extends Card {
    // Elusive.
    // After a player chooses Brobnar as their active house, gain 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChooseActiveHouse: (event) => event.house === 'brobnar'
            },
            gameAction: ability.actions.gainAmber({ amount: 1 })
        });
    }
}

BrobnarPlant.id = 'brobnar-plant';

module.exports = BrobnarPlant;
