const Card = require('../../Card.js');

class DiametricCharge extends Card {
    // Play: Deal 1D to a creature, with 2D splash.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({
                    amount: 1,
                    splash: 2
                })
            }
        });
    }
}

DiametricCharge.id = 'diametric-charge';

module.exports = DiametricCharge;
