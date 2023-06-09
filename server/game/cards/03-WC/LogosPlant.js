const Card = require('../../Card.js');

class LogosPlant extends Card {
    // Elusive.
    // After a player chooses Logos as their active house, gain 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChooseActiveHouse: (event) => event.house === 'logos'
            },
            gameAction: ability.actions.gainAmber({ amount: 1 })
        });
    }
}

LogosPlant.id = 'logos-plant';

module.exports = LogosPlant;
