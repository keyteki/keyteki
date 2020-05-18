const Card = require('../../Card.js');

class CitizenShrix extends Card {
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            gameAction: ability.actions.sequential([
                ability.actions.exalt(),
                ability.actions.steal()
            ])
        });
    }
}

CitizenShrix.id = 'citizen-shrix';

module.exports = CitizenShrix;
