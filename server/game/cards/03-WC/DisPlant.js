const Card = require('../../Card.js');

class DisPlant extends Card {
    // Elusive.
    // After a player chooses Dis as their active house, gain 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChooseActiveHouse: (event) => event.house === 'dis'
            },
            gameAction: ability.actions.gainAmber({ amount: 1 })
        });
    }
}

DisPlant.id = 'dis-plant';

module.exports = DisPlant;
