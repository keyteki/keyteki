const Card = require('../../Card.js');

class RedhandRegistry extends Card {
    //After A is stolen from you, your opponent skips the “forge a key” step during their next turn.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onStealAmber: (event, context) => event.player === context.player
            },
            // this looks strange, but we need to create the skip forge event
            // at the end of the owner of this cards turn so the opponent will start
            // their turn and skip their key forge step.
            gameAction: ability.actions.cardLastingEffect((context) => ({
                duration: 'lastingEffect',
                effect: ability.effects.delayedEffect({
                    when: { onRoundEnded: () => context.player === context.game.activePlayer },
                    gameAction: ability.actions.lastingEffect({
                        targetController: 'opponent',
                        effect: ability.effects.skipStep('key')
                    })
                })
            }))
        });
    }
}

RedhandRegistry.id = 'redhand-registry';

module.exports = RedhandRegistry;
