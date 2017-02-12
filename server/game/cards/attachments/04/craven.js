const DrawCard = require('../../../drawcard.js');

class Craven extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.allowAsAttacker(false)
        });
    }
}

Craven.code = '04026';

module.exports = Craven;
