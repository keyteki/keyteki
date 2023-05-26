const TokenCard = require('../../TokenCard.js');

class Trader extends TokenCard {
    //Action: Steal 1A icon. Destroy Trader.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.sequential([
                ability.actions.steal(),
                ability.actions.destroy()
            ])
        });
    }
}

Trader.id = 'trader';

module.exports = Trader;
