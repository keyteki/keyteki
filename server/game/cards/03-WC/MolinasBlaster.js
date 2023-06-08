const BlasterCard = require('./BlasterCard.js');

class MolinasBlaster extends BlasterCard {
    // This creature gains, Fight/Reap: You may deal 2D to a creature, or attach Molinas Blaster to Armsmaster Molina.
    // After you attach Molinas Blaster to Armsmaster Molina, you may deal 3D to a creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardAttached: (event, context) =>
                    event.card === context.source &&
                    event.parent.name === 'Armsmaster Molina' &&
                    event.context.player === event.card.controller
            },
            target: {
                optional: true,
                mode: 'exactly',
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 3 })
            }
        });

        this.setupBlasterCardAbilities(ability, 'Armsmaster Molina');
    }
}

MolinasBlaster.id = 'molina-s-blaster';

module.exports = MolinasBlaster;
