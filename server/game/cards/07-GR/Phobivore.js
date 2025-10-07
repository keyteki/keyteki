import Card from '../../Card.js';

class Phobivore extends Card {
    // This creature gains “While you are haunted, this creature
    // cannot be used.”
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: (context) => context.source.parent.controller.isHaunted(),
            effect: ability.effects.cardCannot('use')
        });
    }
}

Phobivore.id = 'phobivore';

export default Phobivore;
