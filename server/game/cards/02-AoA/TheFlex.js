const Card = require('../../Card.js');

class TheFlex extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'exhaust {1} and gain {2} amber',
            effectArgs: context => [context.target, Math.floor(context.target.power / 2)],
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: card => card.hasHouse('brobnar') && !card.exhausted,
                gameAction: [
                    ability.actions.exhaust(),
                    ability.actions.gainAmber(context => ({
                        target: context.player,
                        amount: Math.floor(context.target.power / 2)
                    }))
                ]
            }
        });
    }
}

TheFlex.id = 'the-flex';

module.exports = TheFlex;
