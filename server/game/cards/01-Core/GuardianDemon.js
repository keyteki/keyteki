const Card = require('../../Card.js');

class GuardianDemon extends Card {
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            target: {
                cardType: 'creature',
                gameAction: ability.actions.heal({ amount: 2 })
            }
        })
    }
}

GuardianDemon.id = 'guardian-demon'; // This is a guess at what the id might be - please check it!!!

module.exports = GuardianDemon;
