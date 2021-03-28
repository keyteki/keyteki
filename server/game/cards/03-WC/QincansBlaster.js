const BlasterCard = require('./BlasterCard.js');

class QincansBlaster extends BlasterCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardAttached: (event, context) =>
                    event.card === context.source &&
                    event.parent.name === 'Sci. Officer Qincan' &&
                    event.context.player === event.card.controller
            },
            target: {
                optional: true,
                mode: 'exactly',
                cardType: 'creature',
                location: 'play area',
                gameAction: ability.actions.archive()
            }
        });

        this.setupBlasterCardAbilities(ability, 'Sci. Officer Qincan');
    }
}

QincansBlaster.id = 'qincan-s-blaster';

module.exports = QincansBlaster;
