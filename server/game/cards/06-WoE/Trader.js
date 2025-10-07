import Card from '../../Card.js';

class Trader extends Card {
    //Action: Steal 1A icon. Destroy Trader.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.sequential([
                ability.actions.steal(),
                ability.actions.destroy()
            ]),
            effect: 'steal 1 amber and destroy {0}'
        });
    }
}

Trader.id = 'trader';

export default Trader;
