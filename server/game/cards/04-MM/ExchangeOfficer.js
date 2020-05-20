const Card = require('../../Card.js');

class ExchangeOfficer extends Card {
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            fight: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => card.hasHouse('star-alliance'),
                gameAction: ability.actions.use()
            }
        });
    }
}

ExchangeOfficer.id = 'exchange-officer';

module.exports = ExchangeOfficer;
