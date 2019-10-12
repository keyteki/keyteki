const Card = require('../../Card.js');

class NarpsBrew extends Card {
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

NarpsBrew.id = 'narp-s-brew';

module.exports = NarpsBrew;
