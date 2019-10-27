const Card = require('../../Card.js');

class DoctorDriscoll extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                activePromptTitle: 'Choose a creature to heal',
                condition: context => context.game.creaturesInPlay.some(card => card.hasToken('damage')),
                cardType: 'creature',
                gameAction: ability.actions.heal({ amount: 2 })
            },
            then: {
                message: '{0} gains {3} amber due to {1} healing {3} damage',
                messageArgs: context => context.preThenEvent.amount,
                gameAction: ability.actions.gainAmber(context => ({ amount: context.preThenEvent.amount }))
            }
        });
    }
}

DoctorDriscoll.id = 'doctor-driscoll';

module.exports = DoctorDriscoll;

