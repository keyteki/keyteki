const BlasterCard = require('./BlasterCard.js');

class KhrkharsBlaster extends BlasterCard {
    // This creature gains, Fight/Reap: You may deal 2D to a creature, or attach Khrkhars Blaster to Lieutenant Khrkhar.
    // After you attach Khrkhars Blaster to Lieutenant Khrkhar, ward Lieutenant Khrkhar.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardAttached: (event, context) =>
                    event.card === context.source &&
                    event.parent.name === 'Lieutenant Khrkhar' &&
                    event.context.player === event.card.controller
            },
            gameAction: ability.actions.ward((context) => ({ target: context.source.parent }))
        });

        this.setupBlasterCardAbilities(ability, 'Lieutenant Khrkhar');
    }
}

KhrkharsBlaster.id = 'khrkhar-s-blaster';

module.exports = KhrkharsBlaster;
