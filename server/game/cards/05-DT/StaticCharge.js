const Card = require('../../Card.js');

class StaticCharge extends Card {
    // This creature gains, "At the start of your turn, deal 2D to each of this creature's neighbors."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reaction', {
                when: {
                    onBeginRound: (event, context) => context.player === this.game.activePlayer
                },
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: 2,
                    target: context.source.neighbors
                }))
            })
        });
    }
}

StaticCharge.id = 'static-charge';

module.exports = StaticCharge;
