import Card from '../../Card.js';

class IronyxPropaganda extends Card {
    // This creature gains, "After Fight/After Reap: Make a token creature."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.gainAbility('reap', {
                    gameAction: ability.actions.makeTokenCreature()
                }),
                ability.effects.gainAbility('fight', {
                    gameAction: ability.actions.makeTokenCreature()
                })
            ]
        });
    }
}

IronyxPropaganda.id = 'ironyx-propaganda';

export default IronyxPropaganda;
