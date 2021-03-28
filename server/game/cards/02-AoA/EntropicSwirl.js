const Card = require('../../Card.js');

class EntropicSwirl extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: [
                    ability.actions.dealDamage((context) => ({
                        amount: context.target.traits.length * 2
                    })),
                    ability.actions.gainAmber((context) => ({
                        amount: context.target.traits.length,
                        target: context.player
                    }))
                ]
            }
        });
    }
}

EntropicSwirl.id = 'entropic-swirl';

module.exports = EntropicSwirl;
