import Card from '../../Card.js';

class BrackishShoreline extends Card {
    // After a creature fights, it does not ready during its controller's next "ready cards" step.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onFight: (event) => event.attacker.type === 'creature'
            },
            gameAction: ability.actions.cardLastingEffect((context) => ({
                target: context.event.attacker,
                effect: ability.effects.cardCannot(
                    'ready',
                    () => context.game.currentPhase === 'ready'
                )
            }))
        });
    }
}

BrackishShoreline.id = 'brackish-shoreline';

export default BrackishShoreline;
