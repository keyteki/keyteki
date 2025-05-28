const Card = require('../../Card.js');

class PlancinaHiddenAgent extends Card {
    // Destroyed: Destroy each of Plancina, Hidden Agent's neighbors.
    // Fate: Put Plancina, Hidden Agent into play under your control.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.destroy((context) => ({
                target: context.source.neighbors
            }))
        });

        this.fate({
            gameAction: ability.actions.putIntoPlay((context) => ({
                target: context.source,
                myControl: true
            }))
        });
    }
}

PlancinaHiddenAgent.id = 'plancina-hidden-agent';

module.exports = PlancinaHiddenAgent;
