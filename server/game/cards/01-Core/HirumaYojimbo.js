const DrawCard = require('../../drawcard.js');

class HirumaYojimbo extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.cardCannot('declareAsAttacker')
        });
    }
}

HirumaYojimbo.id = 'hiruma-yojimbo';

module.exports = HirumaYojimbo;
