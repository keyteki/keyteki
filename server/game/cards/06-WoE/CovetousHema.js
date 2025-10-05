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
            gameAction: ability.actions.capture({ amount: 3 }),
            message: '{0} uses {1} to capture {2} amber from {3}',
            messageArgs: (context) => [
                context.player,
                context.source,
                Math.min(3, context.player.opponent ? context.player.opponent.amber : 0),
                context.player.opponent
            ]
        });
    }
}

CovetousHema.id = 'covetous-hema';

module.exports = CovetousHema;
