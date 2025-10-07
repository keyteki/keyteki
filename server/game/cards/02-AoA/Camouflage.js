import Card from '../../Card.js';

class Camouflage extends Card {
    // Creatures not on a flank cannot fight this creature.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.cardCannot('attack', (context) => !context.source.isOnFlank())
        });
    }
}

Camouflage.id = 'camouflage';

export default Camouflage;
