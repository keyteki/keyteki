const Card = require('../../Card.js');

class Protectrix extends Card {
    setupCardAbilities(ability) {
        this.reap({
            target: {
                optional: true,
                cardType: 'creature',
                gameAction: ability.actions.heal({ fully: true })
            },
            then: context => ({
                gameAction: ability.actions.cardLastingEffect({
                    target: context.target,
                    effect: ability.effects.cardCannot('damage')
                })
            })
        });
    }
}

Protectrix.id = 'protectrix'; // This is a guess at what the id might be - please check it!!!

module.exports = Protectrix;
