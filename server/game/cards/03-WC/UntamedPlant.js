const Card = require('../../Card.js');

class UntamedPlant extends Card {
    // Elusive.
    // After a player chooses Untamed as their active house, gain 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChooseActiveHouse: (event) => event.house === 'untamed'
            },
            gameAction: ability.actions.gainAmber({ amount: 1 })
        });
    }
}

UntamedPlant.id = 'untamed-plant';

module.exports = UntamedPlant;
