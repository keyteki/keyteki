const Card = require('../../Card.js');

class MogghuntersBrew extends Card {
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

MogghuntersBrew.id = 'mogghunter-s-brew';

module.exports = MogghuntersBrew;
