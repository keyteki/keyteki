import Card from '../../Card.js';

class Sparkfist extends Card {
    // Skirmish. (When you use this creature to fight, it is dealt no damage in return.)
    // Fight: Stun and exhaust the creature Sparkfist fights.
    setupCardAbilities(ability) {
        this.fight({
            effect: 'stun and exhaust {1}',
            effectArgs: (context) => [context.event.card],
            gameAction: [
                ability.actions.stun((context) => ({ target: context.event.card })),
                ability.actions.exhaust((context) => ({ target: context.event.card }))
            ]
        });
    }
}

Sparkfist.id = 'sparkfist';

export default Sparkfist;
