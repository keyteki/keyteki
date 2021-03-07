const Card = require('../../Card.js');

class SeneschalSargassaEvilTwin extends Card {
    //After a player raises the tide, $this captures 2A.
    //This card has been translated from Polish and is subject to change.
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
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Polish and is subject to change."
          ]
        }*/
    }
}

SeneschalSargassaEvilTwin.id = 'seneschal-sargassa-evil-twin';

module.exports = SeneschalSargassaEvilTwin;
