const BlasterCard = require('./BlasterCard.js');

class KirbysBlaster extends BlasterCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardAttached: (event, context) =>
                    event.card === context.source && event.parent.name === 'Com. Officer Kirby' &&
                    event.context.player === event.card.controller
            },
            gameAction: ability.actions.draw({ amount: 2 })
        });

        this.setupBlasterCardAbilities(ability, 'Com. Officer Kirby');
    }
}

KirbysBlaster.id = 'kirby-s-blaster';

module.exports = KirbysBlaster;
