const Card = require('../../Card.js');

class CrepuscularRays extends Card {
    // Play: Choose a friendly creature. Move each A from that
    // creature to your pool. Destroy that creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: [
                    ability.actions.returnAmber((context) => ({
                        all: true,
                        recipient: context.player
                    })),
                    ability.actions.destroy()
                ]
            },
            effect: 'to move all {1} amber from {0} to their pool and destroy {0}',
            effectArgs: (context) => [context.target.amber]
        });
    }
}

CrepuscularRays.id = 'crepuscular-rays';

module.exports = CrepuscularRays;
