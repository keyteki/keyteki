const Card = require('../../Card.js');

class CovetousHema extends Card {
    //While Covetous Hema is not on a flank, it gains elusive.
    //Play: Capture 3A.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => !context.source.isOnFlank(),
            effect: ability.effects.addKeyword({ elusive: 1 })
        });
        this.play({
            gameAction: ability.actions.capture({ amount: 3 })
        });
    }
}

CovetousHema.id = 'covetous-hema';

module.exports = CovetousHema;
