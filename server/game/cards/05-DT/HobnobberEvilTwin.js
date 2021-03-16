const Card = require('../../Card.js');

class HobnobberEvilTwin extends Card {
    //Omni: If your opponent has exactly 1A, steal it.
    setupCardAbilities(ability) {
        this.omni({
            gameAction: ability.actions.steal((context) => ({
                amount: context.player.opponent && context.player.opponent.amber === 1 ? 1 : 0
            }))
        });
    }
}

HobnobberEvilTwin.id = 'hobnobber-evil-twin';

module.exports = HobnobberEvilTwin;
