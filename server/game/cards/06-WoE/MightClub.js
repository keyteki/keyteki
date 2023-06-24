const Card = require('../../Card.js');

class MightClub extends Card {
    //Action: Ready and enrage a creature.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.enrage()
                ])
            },
            effect: 'ready and enrage {0}'
        });
    }
}

MightClub.id = 'might-club';

module.exports = MightClub;
