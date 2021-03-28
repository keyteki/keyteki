const Card = require('../../Card.js');

class CitizenShrix extends Card {
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            effect: 'exalt {0} and steal 1 amber',
            gameAction: ability.actions.sequential([
                ability.actions.exalt(),
                ability.actions.steal()
            ])
        });
    }
}

CitizenShrix.id = 'citizen-shrix';

module.exports = CitizenShrix;
