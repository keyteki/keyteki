const Card = require('../../Card.js');

class OrbOfWonder extends Card {
    setupCardAbilities(ability) {
        this.omni({
            gameAction: ability.actions.sacrifice(),
            then: {
                message: '{0} uses {1} to move a card from their deck to their hand',
                gameAction: ability.actions.search({
                    location: ['deck'],
                    amount: 1
                })
            }
        });
    }
}

OrbOfWonder.id = 'orb-of-wonder';

module.exports = OrbOfWonder;
