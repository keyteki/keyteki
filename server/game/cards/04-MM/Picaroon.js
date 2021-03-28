const Card = require('../../Card.js');

class Picaroon extends Card {
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
