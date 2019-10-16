const Card = require('../../Card.js');

class FirstOfficerFrane extends Card {
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.capture()
            }
        });
    }
}

FirstOfficerFrane.id = 'first-officer-frane';

module.exports = FirstOfficerFrane;
