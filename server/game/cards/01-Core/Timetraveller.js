const Card = require('../../Card.js');

class Timetraveller extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.draw({ amount: 2 })
        });

        this.action({
            gameAction: ability.actions.returnToDeck({ shuffle: true })
        });
    }
}

Timetraveller.id = 'timetraveller';

module.exports = Timetraveller;
