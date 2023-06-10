const Card = require('../../Card.js');

class TransporterPlatform extends Card {
    // Action: Return a friendly creature and each upgrade attached to it to their owners hands.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.returnToHand((context) => ({
                    target: context.target ? context.target.upgrades.concat(context.target) : []
                }))
            }
        });
    }
}

TransporterPlatform.id = 'transporter-platform';

module.exports = TransporterPlatform;
