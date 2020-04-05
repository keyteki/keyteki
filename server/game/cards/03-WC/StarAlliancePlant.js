const Card = require('../../Card.js');

class StaralliancePlant extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChooseActiveHouse: (event) => event.house === 'staralliance'
            },
            gameAction: ability.actions.gainAmber({ amount: 1 })
        });
    }
}

StaralliancePlant.id = 'star-alliance-plant';

module.exports = StaralliancePlant;
