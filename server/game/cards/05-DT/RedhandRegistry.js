import Card from '../../Card.js';

class RedhandRegistry extends Card {
    // After A is stolen from you, your opponent skips the "forge a key" step during their next turn.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onStealAmber: (event, context) => event.player === context.player
            },
            gameAction: ability.actions.untilEndOfMyNextTurn({
                targetController: 'opponent',
                effect: ability.effects.skipStep('key')
            })
        });
    }
}

RedhandRegistry.id = 'redhand-registry';

export default RedhandRegistry;
