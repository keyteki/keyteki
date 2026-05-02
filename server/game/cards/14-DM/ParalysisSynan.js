const Card = require('../../Card.js');

class ParalysisSynan extends Card {
    // After Reap: Stun, enrage, and exhaust a creature.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                gameAction: [
                    ability.actions.stun(),
                    ability.actions.enrage(),
                    ability.actions.exhaust()
                ]
            }
        });
    }
}

ParalysisSynan.id = 'paralysis-synan';

module.exports = ParalysisSynan;
