import Card from '../../Card.js';

class FlamegillEnforcer extends Card {
    // (T) After your opponent raises the tide, enrage Flamegill Enforcer.
    // Action: Capture 3A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onRaiseTide: (event, context) => event.player !== context.player
            },
            gameAction: ability.actions.enrage()
        });
        this.action({
            gameAction: ability.actions.capture({ amount: 3 })
        });
    }
}

FlamegillEnforcer.id = 'flamegill-enforcer';

export default FlamegillEnforcer;
