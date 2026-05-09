const Card = require('../../Card.js');

class CounterfeitControversy extends Card {
    // Play: If your opponent has more amber than you, they lose half of their amber (rounding down the loss).
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                !!context.player.opponent && context.player.opponent.amber > context.player.amber,
            gameAction: ability.actions.loseAmber((context) => ({
                target: context.player.opponent,
                amount: Math.floor(context.player.opponent.amber / 2)
            }))
        });
    }
}

CounterfeitControversy.id = 'counterfeit-controversy';

module.exports = CounterfeitControversy;
