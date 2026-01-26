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
                gameAction: ability.actions.sequentialForEach((context) => ({
                    forEach: context.target,
                    action: (targetCard) =>
                        ability.actions.lastingEffect({
                            until: {
                                onTurnEnd: () => true,
                                onCardLeavesPlay: (event) => event.card === targetCard
                            },
                            effect: ability.effects.canUse((card) => card === targetCard)
                        })
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
