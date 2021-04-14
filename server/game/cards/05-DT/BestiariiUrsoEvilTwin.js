const Card = require('../../Card.js');

class BestiariiUrsoEvilTwin extends Card {
    //Play/Fight: Stun a creature.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            target: {
                cardType: 'creature',
                gameAction: ability.actions.stun()
            }
        });
    }
}

BestiariiUrsoEvilTwin.id = 'bestiarii-urso-evil-twin';

module.exports = BestiariiUrsoEvilTwin;
