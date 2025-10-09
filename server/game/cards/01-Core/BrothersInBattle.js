const Card = require('../../Card.js');

class BrothersInBattle extends Card {
    // Play: Choose a house. For the remainder of the turn, each friendly creature of that house may fight.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'house'
            },
            effect: 'allow creatures from {1} to fight this turn',
            effectArgs: (context) => context.house,
            gameAction: ability.actions.forRemainderOfTurn((context) => ({
                effect: ability.effects.canFight((card) => card.hasHouse(context.house))
            }))
        });
    }
}

BrothersInBattle.id = 'brothers-in-battle';

module.exports = BrothersInBattle;
