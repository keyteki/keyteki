const Card = require('../../Card.js');

class Galeatops extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.limitFightDamage(4)
        });
    }
}

Galeatops.id = 'galeatops';

module.exports = Galeatops;
