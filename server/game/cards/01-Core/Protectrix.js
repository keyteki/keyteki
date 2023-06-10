const Card = require('../../Card.js');

class Protectrix extends Card {
    // Reap: You may fully heal a creature. If you do, that creature cannot be dealt damage for the remainder of the turn.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                optional: true,
                cardType: 'creature',
                gameAction: ability.actions.heal({ fully: true })
            },
            then: (context) => ({
                condition: (context) => context.preThenEvent.amount >= 1,
                gameAction: ability.actions.cardLastingEffect({
                    target: context.target,
                    effect: ability.effects.cardCannot('damage')
                })
            })
        });
    }
}

Protectrix.id = 'protectrix';

module.exports = Protectrix;
