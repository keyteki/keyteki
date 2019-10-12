const Card = require('../../Card.js');

class LogosPlant extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onChooseActiveHouse: (event) => event.house === 'logos'
            },
            gameAction: ability.actions.gainAmber({ amount: 1 })
        });
    }
}

LogosPlant.id = 'logos-plant';

module.exports = LogosPlant;
