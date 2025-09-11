const Card = require('../../Card.js');

class Volax extends Card {
    // Destroyed: Gain A equal to the A in your pool.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.gainAmber((context) => ({
                amount: context.player.amber
            }))
        });
    }
}

Volax.id = 'volax';

module.exports = Volax;
