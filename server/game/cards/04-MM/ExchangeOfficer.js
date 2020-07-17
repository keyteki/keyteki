const Card = require('../../Card.js');

class ExchangeOfficer extends Card {
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            fight: true,
            target: {
                controller: 'self',
                cardCondition: (card) => card.hasHouse('staralliance'),
                gameAction: ability.actions.use()
            }
        });
    }
}

ExchangeOfficer.id = 'exchange-officer';

module.exports = ExchangeOfficer;
