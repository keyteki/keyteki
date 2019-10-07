const Card = require('../../Card.js');

class SaurianPlan extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onChooseActiveHouse: (event) => event.house === 'saurian'
            },
            gameAction: ability.actions.gainAmber({ amount: 1 })
        });
    }
}

SaurianPlan.id = 'saurian-plant';

module.exports = SaurianPlan;
