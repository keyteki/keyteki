const Card = require('../../Card.js');

class Molephin extends Card {
    // Hazardous 3. (Before this creature is attacked, deal 3D to the attacking enemy.)
    // After A is stolen from you, deal 1D to each enemy creature for each A stolen.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onStealAmber: (event, context) => event.player === context.player
            },
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.player.opponent ? context.player.opponent.creaturesInPlay : [],
                amount: context.event.amount
            }))
        });
    }
}

Molephin.id = 'molephin';

module.exports = Molephin;
