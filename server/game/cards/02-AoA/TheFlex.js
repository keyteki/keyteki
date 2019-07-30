const Card = require('../../Card.js');

class TheFlex extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: card => card.hasHouse('brobnar') && !card.exhausted,
                gameAction: [
                    ability.actions.exhaust({used: false}),
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
