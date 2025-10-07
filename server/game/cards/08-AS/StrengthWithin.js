import Card from '../../Card.js';

class StrengthWithin extends Card {
    // This creature gains, “Your opponent’s keys cost +1A for each
    // damage on this creature.”
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('persistentEffect', {
                targetController: 'opponent',
                effect: ability.effects.modifyKeyCost((_, context) =>
                    context.source.tokens && context.source.tokens.damage
                        ? context.source.tokens.damage
                        : 0
                )
            })
        });
    }
}

StrengthWithin.id = 'strength-within';

export default StrengthWithin;
