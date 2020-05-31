const Card = require('../../Card.js');

class AnahitaTheTrader extends Card {
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) => context.player.opponent,
            target: {
                cardType: 'artifact',
                controller: 'self',
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'lastingEffect',
                    effect: ability.effects.takeControl(context.player.opponent)
                }))
            },
            then: {
                gameAction: ability.actions.transferAmber({ amount: 2 })
            },
            effect: 'give control of {0} to {1} and take 2 amber from them',
            effectArgs: (context) => context.player.opponent
        });
    }
}

AnahitaTheTrader.id = 'anahita-the-trader';

module.exports = AnahitaTheTrader;
