const Card = require('../../Card.js');

class BrendTheFanatic extends Card {
    // Skirmish.
    // Play: Your opponent gains 1A.
    // Destroyed: Steal 3A.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect: 'cause {1} to gain 1 amber',
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.gainAmber((context) => ({
                amount: 1,
                target: context.player.opponent
            }))
        });

        this.destroyed({
            gameAction: ability.actions.steal({ amount: 3 })
        });
    }
}

BrendTheFanatic.id = 'brend-the-fanatic';

module.exports = BrendTheFanatic;
