const Card = require('../../Card.js');

class TranspositionSandals extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('action', {
                target: {
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.swap()
                },
                effect: 'swap its position with {0}. You may use {0} this turn',
                gameAction: ability.actions.forRemainderOfTurn((abilityContext) => ({
                    effect: ability.effects.canUse((card) => card === abilityContext.target)
                }))
            })
        });
    }
}

TranspositionSandals.id = 'transposition-sandals';

module.exports = TranspositionSandals;
