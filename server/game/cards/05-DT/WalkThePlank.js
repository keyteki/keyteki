import Card from '../../Card.js';

class WalkThePlank extends Card {
    // Play: If your opponent has no A, deal 4D to a creature. Otherwise, steal 1A.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardCondition: (_, context) =>
                    context.player.opponent && !context.player.opponent.amber,
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 4 })
            },
            gameAction: ability.actions.conditional({
                condition: (context) =>
                    context.player.opponent && context.player.opponent.amber > 0,
                trueGameAction: ability.actions.steal()
            }),
            effect: '{1}{2}',
            effectArgs: (context) =>
                context.player.opponent && !context.player.opponent.amber
                    ? ['deal 4 damage to ', context.target]
                    : ['steal 1 amber from ', context.player.opponent]
        });
    }
}

WalkThePlank.id = 'walk-the-plank';

export default WalkThePlank;
