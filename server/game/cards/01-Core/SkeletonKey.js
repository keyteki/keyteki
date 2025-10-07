import Card from '../../Card.js';

class SkeletonKey extends Card {
    // Action: A friendly creature captures 1A.
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

SkeletonKey.id = 'skeleton-key';

export default SkeletonKey;
