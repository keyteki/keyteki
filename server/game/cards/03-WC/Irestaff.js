const Card = require('../../Card.js');

class Irestaff extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature'
            },
            gameAction: [
                ability.actions.addPowerCounter(context => ({target: context.target})),
                ability.actions.enrage(context => ({target: context.target}))
            ]
        });
    }
}

Irestaff.id = 'irestaff';

module.exports = Irestaff;
