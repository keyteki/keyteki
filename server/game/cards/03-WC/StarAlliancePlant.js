const Card = require('../../Card.js');

class StaralliancePlant extends Card {
    // Elusive.
    // After a player chooses Star Alliance as their active house, gain 1A.
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
