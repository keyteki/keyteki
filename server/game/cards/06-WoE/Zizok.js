import Card from '../../Card.js';

class Zizok extends Card {
    // After an enemy creature is destroyed by Zizok's splash-attack
    // damage, ready Zizok.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    !!event.damageEvent &&
                    event.damageEvent.damageType === 'splash-attack' &&
                    event.damageEvent.damageSource === context.source
            },
            gameAction: ability.actions.ready()
            //effect: "ready {0}"
        });
    }
}

Zizok.id = 'zizok';

export default Zizok;
