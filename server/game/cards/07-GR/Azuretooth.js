const Card = require('../../Card.js');

class Azuretooth extends Card {
    // After Fight/After Reap: Move each A from a friendly creature to
    // your pool. Give control of that creature to your opponent.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.returnAmber((context) => ({
                    all: true,
                    recipient: context.player
                }))
            },
            effect: 'move all {2} amber from {0} to their pool and give control of {0} to {1}',
            effectArgs: (context) => [context.player.opponent, context.target.amber],
            then: (preThenContext) => ({
                alwaysTriggers: true,
                condition: (context) => !!context.player.opponent,
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    target: preThenContext.target,
                    duration: 'lastingEffect',
                    effect: ability.effects.takeControl(context.player.opponent)
                }))
            })
        });
    }
}

Azuretooth.id = 'azuretooth';

module.exports = Azuretooth;
