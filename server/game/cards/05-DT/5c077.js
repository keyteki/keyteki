const Card = require('../../Card.js');

class FiveC077 extends Card {
    //Reap: Ready and use a friendly creature with the same power as 5C077.
    //You may give 5C077 a +1 power counter or remove a +1 power counter from 5C077.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card, context) =>
                    card !== context.source && card.power === context.source.power,
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.use()
                ])
            },
            then: {
                alwaysTriggers: true,
                target: {
                    mode: 'select',
                    choices: {
                        'Add a power counter': ability.actions.addPowerCounter(),
                        'Remove a power counter': ability.actions.removePowerCounter(),
                        Cancel: () => true
                    }
                }
            }
        });
    }
}

FiveC077.id = '5c077';

module.exports = FiveC077;
