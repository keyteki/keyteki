const Card = require('../../Card.js');

class ZyzzixTheMany extends Card {
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            optional: true,
            target: {
                optional: true,
                cardType: 'creature',
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.reveal()
            },
            then: (context) => ({
                gameAction: [
                    ability.actions.archive({ target: context.target }),
                    ability.actions.addPowerCounter({ amount: 3 })
                ]
            })
        });
    }
}

ZyzzixTheMany.id = 'zyzzix-the-many';

module.exports = ZyzzixTheMany;
