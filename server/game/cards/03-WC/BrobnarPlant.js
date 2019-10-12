const Card = require('../../Card.js');

class BrobnarPlant extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onChooseActiveHouse: (event) => event.house === 'brobnar'
            },
            gameAction: ability.actions.gainAmber({ amount: 1 })
        });
    }
}

BrobnarPlant.id = 'brobnar-plant';

module.exports = BrobnarPlant;
