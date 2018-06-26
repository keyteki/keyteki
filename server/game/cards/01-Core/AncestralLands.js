const ProvinceCard = require('../../provincecard.js');

class AncestralLands extends ProvinceCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            condition: () => this.game.isDuringConflict('political'),
            effect: ability.effects.modifyProvinceStrength(5)
        });
    }
}

AncestralLands.id = 'ancestral-lands';

module.exports = AncestralLands;
