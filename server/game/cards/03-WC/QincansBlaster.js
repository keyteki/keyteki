const BlasterCard = require('./BlasterCard.js');

class QincansBlaster extends BlasterCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardAttached: (event, context) =>
                    event.card === context.source && event.parent.name === 'Sci. Officer Qincan' &&
                    event.context.player === event.card.controller
            },
            gameAction: ability.actions.archive({
                optional: true,
                promptForSelect: {
                    optional: true,
                    cardType: 'creature'
                }
            })
        });

        this.setupBlasterCardAbilities(ability, 'Sci. Officer Qincan');
    }
}

QincansBlaster.id = 'qincan-s-blaster';

module.exports = QincansBlaster;
