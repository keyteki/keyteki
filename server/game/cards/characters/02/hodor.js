const DrawCard = require('../../../drawcard.js');

class Hodor extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.controller.findCardByName(this.controller.cardsInPlay, 'Bran Stark'),
            match: this,
            effect: ability.effects.allowAsAttacker(false)
        });
    }

    modifyDominance(player, strength) {
        if(this.controller !== player || this.kneeled || this.isBlank()) {
            return strength;
        }

        return strength - this.getStrength();
    }
}

Hodor.code = '02061';

module.exports = Hodor;
