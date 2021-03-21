const Card = require('../../Card.js');

class SeneschalSargassa extends Card {
    //After a player raises the tide, a creature they control captures 2A from their opponent.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onRaiseTide: () => true
            },
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.controller.isTideHigh(),
                gameAction: ability.actions.capture((context) => ({
                    player: context.target.controller.opponent,
                    amount: 2
                }))
            }
        });
    }
}

SeneschalSargassa.id = 'seneschal-sargassa';

module.exports = SeneschalSargassa;
