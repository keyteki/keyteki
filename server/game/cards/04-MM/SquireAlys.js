import Card from '../../Card.js';

class SquireAlys extends Card {
    // Play: Capture 2A.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture({ amount: 2 })
        });
    }
}

SquireAlys.id = 'squire-alys';

export default SquireAlys;
