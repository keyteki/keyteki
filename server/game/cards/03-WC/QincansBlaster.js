const BlasterCard = require('./BlasterCard.js');

class QincansBlaster extends BlasterCard {
    // This creature gains, Fight/Reap: You may deal 2D to a creature, or attach Qincans Blaster to Sci. Officer Qincan.
    // After you attach Qincans Blaster to Sci. Officer Qincan, you may archive a creature in play.
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
