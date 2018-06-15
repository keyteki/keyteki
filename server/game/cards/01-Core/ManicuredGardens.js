const ProvinceCard = require('../../provincecard.js');

class ManicuredGarden extends ProvinceCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain 1 fate',
            condition: context => context.source.isConflictProvince(),
            gameAction: ability.actions.gainFate()
        });
    }
}

ManicuredGarden.id = 'manicured-garden';

module.exports = ManicuredGarden;
