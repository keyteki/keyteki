const Card = require('../../Card.js');

class SeneschalSargassaEvilTwin extends Card {
    //After a player raises the tide, this captures 2A.
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

module.exports = SeneschalSargassaEvilTwin;
