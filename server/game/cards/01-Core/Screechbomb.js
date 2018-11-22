const Card = require('../../Card.js');

class Screechbomb extends Card {
    setupCardAbilities(ability) {
        this.omni({
            condition: context => !!context.player.opponent,
            effect: 'sacrifice {0} and make {1} lost 2 amber',
            effectArgs: context => context.player.opponent,
            gameAction: [
                ability.actions.sacrifice(),
                ability.actions.loseAmber({ amount: 2 })
            ]
        });
    }
}

Screechbomb.id = 'screechbomb'; // This is a guess at what the id might be - please check it!!!

module.exports = Screechbomb;
