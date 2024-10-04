const Card = require('../../Card.js');

class ShaeCloudkicker extends Card {
    // Play/After Reap: Swap Shae “Cloudkicker” with another friendly
    // creature in your battleline.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card, context) => card !== context.source,
                gameAction: ability.actions.swap()
            }
        });
    }
}

ShaeCloudkicker.id = 'shae-cloudkicker';

module.exports = ShaeCloudkicker;
