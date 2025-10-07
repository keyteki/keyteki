import Card from '../../Card.js';

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
                controller: context.game.activePlayer
            }))
        });
    }
}

PlancinaHiddenAgent.id = 'plancina-hidden-agent';

export default PlancinaHiddenAgent;
