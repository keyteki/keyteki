const BlasterCard = require('./BlasterCard.js');

class KhrkharsBlaster extends BlasterCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardAttached: (event, context) =>
                    event.card === context.source && event.parent.name === 'Lieutenant Khrkhar' &&
                    event.context.player === event.card.controller
            },
            gameAction: ability.actions.ward(context => ({ target: context.source.parent }))
        });

        this.setupBlasterCardAbilities(ability, 'Lieutenant Khrkhar');
    }
}

KhrkharsBlaster.id = 'khrkhar-s-blaster';

module.exports = KhrkharsBlaster;
