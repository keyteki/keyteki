import Card from '../../Card.js';

class CornicenOctavia extends Card {
    // Action: Capture 2.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.capture({ amount: 2 })
        });
    }
}

CornicenOctavia.id = 'cornicen-octavia';

export default CornicenOctavia;
