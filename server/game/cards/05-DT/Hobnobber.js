const Card = require('../../Card.js');

class Hobnobber extends Card {
    //Action: If your opponent has 6A or more, steal 2A.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.steal((context) => ({
                amount: context.player.opponent && context.player.opponent.amber >= 6 ? 2 : 0
            }))
        });
    }
}

Hobnobber.id = 'hobnobber';

module.exports = Hobnobber;
