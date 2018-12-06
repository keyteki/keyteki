const Card = require('../../Card.js');

class CombatPheromones extends Card {
    setupCardAbilities(ability) {
        this.omni({
            target: {
                mode: 'upTo',
                numCards: 2,
                controller: 'self',
                cardCondition: card => card.hasHouse('mars'),
                gameAction: ability.actions.forRemainderOfTurn(context => ({
                    effect: ability.effects.canUse(card => context.target.includes(card))
                }))
            },
            effect: 'sacrifice {0} and allow them to use {0} this turn',
            gameAction: ability.actions.sacrifice()
        });
    }
}

CombatPheromones.id = 'combat-pheromones'; // This is a guess at what the id might be - please check it!!!

module.exports = CombatPheromones;
