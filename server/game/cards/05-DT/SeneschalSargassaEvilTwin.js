import Card from '../../Card.js';

class SeneschalSargassaEvilTwin extends Card {
    // (T) After a player raises the tide, Seneschal Sargassa captures 2A from your opponent.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onRaiseTide: () => true
            },
            gameAction: ability.actions.capture((context) => ({
                target: context.source,
                amount: 2
            }))
        });
    }
}

SeneschalSargassaEvilTwin.id = 'seneschal-sargassa-evil-twin';

export default SeneschalSargassaEvilTwin;
