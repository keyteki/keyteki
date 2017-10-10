const ProvinceCard = require('../../provincecard.js');

class ManicuredGardens extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Gain 1 fate',
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictProvince === this,
            handler: () => {
                this.game.addMessage('{0} uses {1} to gain 1 fate', this.controller, this);
                this.game.addFate(this.controller, 1);
            }
        });
    }
}

ManicuredGardens.id = 'manicured-gardens';

module.exports = ManicuredGardens;
