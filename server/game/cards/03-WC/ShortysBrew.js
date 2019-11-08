const Card = require('../../Card.js');

class ShortysBrew extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.addPowerCounter({
                    amount: 2
                })
            }
        });
    }
}

ShortysBrew.id = 'shorty-s-brew';

module.exports = ShortysBrew;
