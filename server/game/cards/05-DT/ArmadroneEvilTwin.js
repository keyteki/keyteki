import Card from '../../Card.js';

class ArmadroneEvilTwin extends Card {
    // Fight: Steal 2A.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.steal({ amount: 2 })
        });
    }
}

ArmadroneEvilTwin.id = 'armadrone-evil-twin';

export default ArmadroneEvilTwin;
