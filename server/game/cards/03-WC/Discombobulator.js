const Card = require('../../Card.js');

class Discombobulator extends Card {
    // This creature gains, Your A cannot be stolen.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('persistentEffect', {
                effect: ability.effects.playerCannot('steal')
            })
        });
    }
}

Discombobulator.id = 'discombobulator';

module.exports = Discombobulator;
