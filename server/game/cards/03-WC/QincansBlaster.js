const BlasterCard = require('./BlasterCard.js');

class QincansBlaster extends BlasterCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardAttached: event => event.card === this && event.parent.name === 'Sci. Officer Qincan'
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
