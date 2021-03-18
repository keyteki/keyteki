const Card = require('../../Card.js');

class GiltspineNetcasterEvilTwin extends Card {
    //Reap: Ready and use a non-Aquan friendly creature.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => !card.hasTrait('aquan'),
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.use()
                ])
            },
            effect: 'ready and use {0}'
        });
    }
}

GiltspineNetcasterEvilTwin.id = 'giltspine-netcaster-evil-twin';

module.exports = GiltspineNetcasterEvilTwin;
