const DrawCard = require('../../drawcard.js');

class HirumaYojimbo extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.cannotBeDeclaredAsAttacker()
        });
    }
}

HirumaYojimbo.id = 'hiruma-yojimbo';

module.exports = HirumaYojimbo;
