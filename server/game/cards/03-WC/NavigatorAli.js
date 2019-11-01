const Card = require('../../Card.js');

class NavigatorAli extends Card {
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            gameAction: ability.actions.rearrangeCards({ amount: 3 })
        });
    }
}

NavigatorAli.id = 'navigator-ali';

module.exports = NavigatorAli;
