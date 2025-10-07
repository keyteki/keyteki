import Card from '../../Card.js';

class GravePixie extends Card {
    // Destroyed: If you are haunted, archive Grave Pixie.
    setupCardAbilities(ability) {
        this.destroyed({
            condition: (context) => context.source.controller.isHaunted(),
            gameAction: ability.actions.archive((context) => ({
                target: context.source
            }))
        });
    }
}

GravePixie.id = 'grave-pixie';

export default GravePixie;
