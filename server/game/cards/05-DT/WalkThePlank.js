const Card = require('../../Card.js');

class WalkThePlank extends Card {
    // Play: If your opponent has no A, deal 4D to a creature. Otherwise, steal 1A.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardCondition: (_, context) =>
                    context.player.opponent && !context.player.opponent.amber,
                cardType: 'creature'
            },
            gameAction: ability.actions.conditional({
                condition: (context) => context.player.opponent && !context.player.opponent.amber,
                trueGameAction: ability.actions.dealDamage((context) => ({
                    amount: 4,
                    target: context.target
                })),
                falseGameAction: ability.actions.steal()
            }),
            effect: '{1}{2}',
            effectArgs: (context) =>
                context.player.opponent && !context.player.opponent.amber
                    ? ['deal 4 damage to ', context.target]
                    : ['steal 1 amber']
        });
    }
}

WalkThePlank.id = 'walk-the-plank';

module.exports = WalkThePlank;
