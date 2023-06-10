const Card = require('../../Card.js');

class JehuTheBureaucrat extends Card {
    // After you choose Sanctum as your active house, gain 2<A>.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChooseActiveHouse: (event, context) =>
                    event.player === context.player && event.house === 'sanctum'
            },
            gameAction: ability.actions.gainAmber({ amount: 2 })
        });
    }
}

JehuTheBureaucrat.id = 'jehu-the-bureaucrat';

module.exports = JehuTheBureaucrat;
