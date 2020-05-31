const Card = require('../../Card.js');

class DoctorDriscoll extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.heal({ amount: 2 })
            },
            then: {
                message: '{0} gains {3} amber due to {1} healing {3} damage',
                messageArgs: (context) => context.preThenEvent.amount,
                gameAction: ability.actions.gainAmber((context) => ({
                    amount: context.preThenEvent.amount
                }))
            }
        });
    }
}

DoctorDriscoll.id = 'doctor-driscoll';

module.exports = DoctorDriscoll;
