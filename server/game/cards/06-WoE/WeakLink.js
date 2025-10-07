import Card from '../../Card.js';

class WeakLink extends Card {
    //This creature gains, "While this creature is exhausted, your keys cost +6A icon."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('persistentEffect', {
                targetController: 'current',
                effect: ability.effects.modifyKeyCost((player, context) =>
                    context.source.exhausted ? 6 : 0
                )
            })
        });
    }
}

WeakLink.id = 'weak-link';

export default WeakLink;
