const Card = require('../../Card.js');

class GiltspineSchool extends Card {
    // Play: Make 3 token creatures.
    //
    // Token creatures do not ready during their controller's "ready
    // cards" step.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature({ amount: 3 })
        });

        this.persistentEffect({
            targetController: 'any',
            match: (card) => card.isToken(),
            effect: ability.effects.doesNotReady()
        });
    }
}

GiltspineSchool.id = 'giltspine-school';

module.exports = GiltspineSchool;
