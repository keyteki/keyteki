const Card = require('../../Card.js');

class TheAmberRoad extends Card {
    // Omni: Put 1 trade counter on The Æmber Road, then gain 1 Aember for each trade counter on it. Give control of The Æmber Road to your opponent.
    setupCardAbilities(ability) {
        this.omni({
            effect: 'to put a trade counter on {0}, gain {1} amber, and give control to {2}',
            effectArgs: (context) => [
                context.source.tokens.trade ? context.source.tokens.trade + 1 : 1,
                context.player.opponent
            ],
            gameAction: ability.actions.addTradeCounter(),
            then: {
                gameAction: ability.actions.sequential([
                    ability.actions.gainAmber((context) => ({
                        amount: context.source.tokens.trade
                    })),
                    ability.actions.cardLastingEffect((context) => ({
                        duration: 'lastingEffect',
                        target: this,
                        effect: ability.effects.takeControl(context.player.opponent)
                    }))
                ])
            }
        });
    }
}

TheAmberRoad.id = 'the-æmber-road';

module.exports = TheAmberRoad;
