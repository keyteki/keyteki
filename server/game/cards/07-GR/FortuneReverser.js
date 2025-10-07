import Card from '../../Card.js';

class FortuneReverser extends Card {
    // This creature's text box is considered blank, except for traits.
    //
    // Play: Destroy all other upgrades attached to this creature.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.blank()
        });

        this.play({
            gameAction: ability.actions.destroy((context) => ({
                target: context.source.parent.upgrades.filter((c) => c !== context.source)
            })),
            effect: 'destroy each upgrade attached to {1}',
            effectArgs: (context) => [context.source.parent]
        });
    }
}

FortuneReverser.id = 'fortune-reverser';

export default FortuneReverser;
