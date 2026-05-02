const Card = require('../../Card.js');

class VaelraWhisperfang extends Card {
    // After your opponent plays a creature, deal 2 damage to it.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.type === 'creature' &&
                    event.player === context.source.controller.opponent
            },
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 2,
                target: context.event.card
            }))
        });
    }
}

VaelraWhisperfang.id = 'vaelra-whisperfang';

module.exports = VaelraWhisperfang;
