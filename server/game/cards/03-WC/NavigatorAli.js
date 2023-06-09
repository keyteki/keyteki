const Card = require('../../Card.js');

class NavigatorAli extends Card {
    // Play/Fight/Reap: Look at the top 3 cards of your deck and put them back in any order.
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
