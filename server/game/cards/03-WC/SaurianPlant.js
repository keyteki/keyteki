const Card = require('../../Card.js');

class SaurianPlant extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChooseActiveHouse: (event) => event.house === 'saurian'
            },
            gameAction: ability.actions.gainAmber({ amount: 1 })
        });
    }
}

SaurianPlant.id = 'saurian-plant';

module.exports = SaurianPlant;
