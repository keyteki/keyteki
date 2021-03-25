const Card = require('../../Card.js');

class ReachAdvantage extends Card {
    //Play: If the tide is high, a friendly creature captures 3A. Otherwise, raise the tide.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardCondition: (_, context) => context.player.isTideHigh(),
                cardType: 'creature',
                controller: 'self'
            },
            gameAction: ability.actions.conditional({
                condition: (context) => context.player.isTideHigh(),
                trueGameAction: ability.actions.capture((context) => ({
                    amount: 3,
                    target: context.target
                })),
                falseGameAction: ability.actions.raiseTide()
            }),
            effect: '{1}',
            effectArgs: (context) => (context.player.isTideHigh() ? 'capture 3A' : 'raise the tide')
        });
    }
}

ReachAdvantage.id = 'reach-advantage';

module.exports = ReachAdvantage;
