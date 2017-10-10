const DrawCard = require('../../drawcard.js');

class ShibaPeacemaker extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.cannotBeDeclaredAsAttacker
        });
    }
}

ShibaPeacemaker.id = 'shiba-peacemaker';

module.exports = ShibaPeacemaker;
