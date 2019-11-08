const BlasterCard = require('./BlasterCard.js');

class MolinasBlaster extends BlasterCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardAttached: (event, context) =>
                    event.card === context.source && event.parent.name === 'Armsmaster Molina' &&
                    event.context.player === event.card.controller
            },
            gameAction: ability.actions.dealDamage({
                amount: 3,
                promptForSelect: {
                    optional: true,
                    cardType: 'creature'
                }
            })
        });

        this.setupBlasterCardAbilities(ability, 'Armsmaster Molina');
    }
}

MolinasBlaster.id = 'molina-s-blaster';

module.exports = MolinasBlaster;
