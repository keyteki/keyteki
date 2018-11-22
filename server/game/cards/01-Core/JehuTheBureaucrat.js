const Card = require('../../Card.js');

class JehuTheBureaucrat extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onChooseActiveHouse: (event, context) => event.player === context.player && event.house === 'sanctum'
            },
            gameAction: ability.actions.gainAmber({ amount: 2 })
        });
    }
}

JehuTheBureaucrat.id = 'jehu-the-bureaucrat'; // This is a guess at what the id might be - please check it!!!

module.exports = JehuTheBureaucrat;
