const Card = require('../../Card.js');

class ZyzzixTheMany extends Card {
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            optional: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.reveal()
            },
            then: context => ({
                gameAction: [
                    ability.actions.archive({ target: context.target }),
                    ability.actions.addPowerCounter({ amount: 3 })
                ]
            })
        });
    }
}

ZyzzixTheMany.id = 'zyzzix-the-many'; // This is a guess at what the id might be - please check it!!!

module.exports = ZyzzixTheMany;
