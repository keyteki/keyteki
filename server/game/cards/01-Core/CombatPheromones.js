const Card = require('../../Card.js');

class CombatPheromones extends Card {
    // Omni: Sacrifice Combat Pheromones. You may use up to 2 other Mars cards this turn.
    setupCardAbilities(ability) {
        this.omni({
            target: {
                mode: 'upTo',
                numCards: 2,
                controller: 'self',
                cardCondition: (card) => card.hasHouse('mars'),
                gameAction: ability.actions.forRemainderOfTurn((context) => ({
                    effect: ability.effects.canUse((card) => context.target.includes(card))
                }))
            },
            effect: 'sacrifice {1} and allow them to use {0} this turn',
            effectArgs: (context) => context.source,
            gameAction: ability.actions.sacrifice()
        });
    }
}

CombatPheromones.id = 'combat-pheromones';

module.exports = CombatPheromones;
