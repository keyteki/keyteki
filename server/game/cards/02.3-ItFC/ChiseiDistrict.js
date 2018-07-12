const DrawCard = require('../../drawcard.js');

class ChiseiDistrict extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'province',
            condition: () => this.game.isDuringConflict('military'),
            match: card => card.isProvince && card.location === this.location && card.controller === this.controller,
            effect: ability.effects.cardCannot('initiateConflict')
        });
    }
}

ChiseiDistrict.id = 'chisei-district'; // This is a guess at what the id might be - please check it!!!

module.exports = ChiseiDistrict;
