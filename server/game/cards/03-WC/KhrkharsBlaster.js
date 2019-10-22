const BlasterCard = require('./BlasterCard.js');

class KhrkharsBlaster extends BlasterCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardAttached: event => event.card === this && event.parent.name === 'Lieutenant Khrkhar'
            },
            gameAction: ability.actions.ward(context => ({ target: context.source.parent }))
        });

        this.setupBlasterCardAbilities(ability, 'Khrkhar\'s Blaster', 'Lieutenant Khrkhar');
    }
}

KhrkharsBlaster.id = 'khrkhar-s-blaster';

module.exports = KhrkharsBlaster;
