const Card = require('../../Card.js');

class ArmadroneEvilTwin extends Card {
    //Fight: Steal 2A.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.steal({ amount: 2 })
        });
    }
}

ArmadroneEvilTwin.id = 'armadrone-evil-twin';

module.exports = ArmadroneEvilTwin;
