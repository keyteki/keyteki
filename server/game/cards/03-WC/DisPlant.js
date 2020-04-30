const Card = require('../../Card.js');

class DisPlant extends Card {
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
