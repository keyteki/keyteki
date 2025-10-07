import Card from '../../Card.js';

class EfficientAmberBurner extends Card {
    // This creature gains, “Your opponent’s keys cost –1A for each A
    // on this creature.”
    // This creature gains, “After Reap: Exalt this creature.”
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.gainAbility('persistentEffect', {
                    targetController: 'opponent',
                    effect: ability.effects.modifyKeyCost((_, context) => -context.source.amber)
                }),
                ability.effects.gainAbility('reap', {
                    gameAction: ability.actions.exalt()
                })
            ]
        });
    }
}

EfficientAmberBurner.id = 'efficient-æmber-burner';

export default EfficientAmberBurner;
