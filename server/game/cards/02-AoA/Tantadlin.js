const Card = require('../../Card.js');

class Tantadlin extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.limitFightDamage(2)
        });
        this.fight({
            gameAction: ability.actions.discardAtRandom({ amount: 1, location: 'archives'})
        });
    }
}

Tantadlin.id = 'tantadlin';

module.exports = Tantadlin;
