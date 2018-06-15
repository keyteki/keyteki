const ProvinceCard = require('../../provincecard.js');

class FertileFields extends ProvinceCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw a card',
            condition: context => this.game.currentConflict && this.game.currentConflict.conflictProvince === context.source,
            gameAction: ability.actions.draw()
        });
    }
}

FertileFields.id = 'fertile-fields';

module.exports = FertileFields;
