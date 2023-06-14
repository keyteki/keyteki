const Card = require('../../Card.js');

class Picaroon extends Card {
    // Deploy. (This creature can enter play anywhere in your battleline.)
    // X is the combined power of Picaroons non-Changeling neighbors.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyPower((card) =>
                card.neighbors
                    .filter((c) => !c.hasTrait('changeling'))
                    .map((c) => c.power)
                    .reduce((total, power) => total + power, 0)
            )
        });
    }
}

Picaroon.id = 'picaroon';

module.exports = Picaroon;
