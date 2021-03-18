const Card = require('../../Card.js');

class BeastFighterUrsoEvilTwin extends Card {
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

BeastFighterUrsoEvilTwin.id = 'beast-fighter-urso-evil-twin';

module.exports = BeastFighterUrsoEvilTwin;
