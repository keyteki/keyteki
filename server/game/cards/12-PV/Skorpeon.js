import Card from '../../Card.js';

class Skorpeon extends Card {
    // Enhance .
    // After Reap: Deal 2 to an enemy creature for each of Skorpeon's Dis neighbors.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.allocateDamage((context) => ({
                controller: 'opponent',
                numSteps: context.source.neighbors.filter((card) => card.hasHouse('dis')).length,
                damageStep: 2
            })),
            effect: 'deal 2 damage to an enemy creature {1} time{2}',
            effectArgs: (context) => [
                context.source.neighbors.filter((card) => card.hasHouse('dis')).length,
                context.source.neighbors.filter((card) => card.hasHouse('dis')).length === 1
                    ? ''
                    : 's'
            ]
        });
    }
}

Skorpeon.id = 'skorpeon';

export default Skorpeon;
