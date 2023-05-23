const Card = require('../../Card.js');

class TheAmberRoad extends Card {
    setupCardAbilities(ability) {
        this.omni({
            effect: 'put a token on {0}, gain {1} amber, and give control to your opponent',
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
