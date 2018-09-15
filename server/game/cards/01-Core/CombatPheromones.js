const Card = require('../../Card.js');

class CombatPheromones extends Card {
    setupCardAbilities(ability) {
        this.omni({
            effect: 'sacrifice {0} and allow them to use 2 Mars cards this turn',
            gameAction: [
                ability.actions.sacrifice(),
                ability.actions.forRemainderOfTurn({
                    effect: [ability.effects.canUseHouse('mars'), ability.effects.canUseHouse('mars')]
                })
            ]
        });
    }
}

CombatPheromones.id = 'combat-pheromones'; // This is a guess at what the id might be - please check it!!!

module.exports = CombatPheromones;
