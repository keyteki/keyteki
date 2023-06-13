const Card = require('../../Card.js');

class Irestaff extends Card {
    // Action: Enrage a creature. Give that creature a +1 power counter.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature'
            },
            message: '{0} uses {1} to enrage and add a +1 power counter to {2}',
            messageArgs: (context) => [context.player, context.source, context.target],
            gameAction: [
                ability.actions.enrage((context) => ({ target: context.target })),
                ability.actions.addPowerCounter((context) => ({ target: context.target }))
            ]
        });
    }
}

Irestaff.id = 'irestaff';

module.exports = Irestaff;
