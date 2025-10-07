import Card from '../../Card.js';

class Ceaseforge extends Card {
    // Play: Put 2 time counters on Ceaseforge.
    // Players cannot forge keys.
    // At the start of your turn, remove a time counter from Ceaseforge, then destroy it if there are no time counters on it.
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

export default Ceaseforge;
