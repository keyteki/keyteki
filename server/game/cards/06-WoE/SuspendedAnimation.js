import Card from '../../Card.js';

class SuspendedAnimation extends Card {
    // Play: Put a damaged enemy creature into your archives. If it
    // leaves your archives, put it into its owner's hand instead.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                cardCondition: (card) => card.hasToken('damage'),
                gameAction: ability.actions.archive({
                    owner: false
                })
            }
        });
    }
}

SuspendedAnimation.id = 'suspended-animation';

export default SuspendedAnimation;
