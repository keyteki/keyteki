import Card from '../../Card.js';

class FlamegillEnforcerEvilTwin extends Card {
    // (T) After your opponent raises the tide, enrage Flamegill Enforcer.
    // Action: Steal 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onRaiseTide: (event, context) => event.player !== context.player
            },
            gameAction: ability.actions.enrage()
        });
        this.action({
            gameAction: ability.actions.steal()
        });
    }
}

FlamegillEnforcerEvilTwin.id = 'flamegill-enforcer-evil-twin';

export default FlamegillEnforcerEvilTwin;
