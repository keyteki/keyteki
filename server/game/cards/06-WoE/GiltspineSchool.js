const Card = require('../../Card.js');

class GiltspineSchool extends Card {
    // Play: Make 3 token creatures.
    // Token creatures do not ready during their controller's "ready cards" step.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature({ amount: 3 })
            // Token creatures do not ready during their controller's "ready cards" step.
        });
    }
}

GiltspineSchool.id = 'giltspine-school';

module.exports = GiltspineSchool;
