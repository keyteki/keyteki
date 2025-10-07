import Card from '../../Card.js';

class ReachAdvantage extends Card {
    // (T) Play: If the tide is high, a friendly creature captures 3A. Otherwise, raise the tide.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardCondition: (_, context) => context.player.isTideHigh(),
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.capture({ amount: 3 })
            },
            gameAction: ability.actions.conditional({
                condition: (context) => !context.player.isTideHigh(),
                trueGameAction: ability.actions.raiseTide()
            }),
            effect: '{1}{2}',
            effectArgs: (context) =>
                context.player.isTideHigh()
                    ? ['capture 3 amber on ', context.target]
                    : ['raise the tide']
        });
    }
}

ReachAdvantage.id = 'reach-advantage';

export default ReachAdvantage;
