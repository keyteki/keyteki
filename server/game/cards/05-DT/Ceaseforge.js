const Card = require('../../Card.js');

class Ceaseforge extends Card {
    //Reap: Put an ignorance counter on an enemy creature.
    //As long as that creature has an ignorance counter, its text box is considered blank (except for traits).
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.addTimeCounter((context) => ({
                amount: 2,
                target: context.source
            }))
        });

        this.reaction({
            when: {
                onBeginRound: (event, context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.removeTimeCounter((context) => ({
                target: context.source
            })),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.destroy((context) => ({
                    target: !context.source.hasToken('time') ? context.source : []
                }))
            }
        });

        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.playerCannot('forge')
        });
    }
}

Ceaseforge.id = 'ceaseforge';

module.exports = Ceaseforge;
