const Card = require('../../Card.js');

class UntamedPlant extends Card {
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
