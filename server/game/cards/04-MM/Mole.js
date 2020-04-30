const Card = require('../../Card.js');

class Mole extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.keyAmberOpponent()
        });
    }
}

Mole.id = 'mole';

module.exports = Mole;
