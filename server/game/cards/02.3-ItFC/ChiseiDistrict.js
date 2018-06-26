const DrawCard = require('../../drawcard.js');

class ChiseiDistrict extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'province',
            match: card => card.isProvince && card.location === this.location && card.controller === this.controller,
            effect: ability.effects.cardCannot('initiateConflict', () => this.game.isDuringConflict('military'))
        });
    }
}

ChiseiDistrict.id = 'chisei-district'; // This is a guess at what the id might be - please check it!!!

module.exports = ChiseiDistrict;
