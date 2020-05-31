const Card = require('../../Card.js');

class FesteringTouch extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'upTo',
                numCards: 2,
                cardType: 'creature',
                gameAction: [
                    ability.actions.dealDamage((context) => ({
                        amount: 3,
                        target: context.target.filter((card) => card.hasToken('damage'))
                    })),
                    ability.actions.dealDamage((context) => ({
                        amount: 1,
                        target: context.target.filter((card) => !card.hasToken('damage'))
                    }))
                ]
            }
        });
    }
}

FesteringTouch.id = 'festering-touch';

module.exports = FesteringTouch;
