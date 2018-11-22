const Card = require('../../Card.js');

class SkeletonKey extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.capture()
            }
        });
    }
}

SkeletonKey.id = 'skeleton-key'; // This is a guess at what the id might be - please check it!!!

module.exports = SkeletonKey;
