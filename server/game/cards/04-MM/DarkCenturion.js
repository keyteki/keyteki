const Card = require('../../Card.js');

class DarkCenturion extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                mode: 'exactly',
                numCards: 1,
                cardType: 'creature',
                cardCondition: card => card.hasToken('amber'),
                gameAction: ability.actions.sequential([
                    ability.actions.removeAmber({ amount: 1 }),
                    ability.actions.ward()
                ])
            }
        });
    }
}

DarkCenturion.id = 'dark-centurion';
module.exports = DarkCenturion;
