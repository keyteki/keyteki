const Card = require('../../Card.js');

class NerveBlast extends Card {
    // Play: Steal 1A. If you do, deal 2D to a creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.steal(),
            then: {
                target: {
                    cardType: 'creature',
                    gameAction: ability.actions.dealDamage({ amount: 2 })
                },
                message: '{0} uses {1} to deal 2 damage to {2}',
                messageArgs: (context) => {
                    return [context.player, context.source, context.target];
                }
            }
        });
    }
}

NerveBlast.id = 'nerve-blast';

module.exports = NerveBlast;
