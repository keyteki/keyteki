const ProvinceCard = require('../../provincecard.js');

class ManicuredGarden extends ProvinceCard {
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

ManicuredGarden.id = 'manicured-garden';

module.exports = ManicuredGarden;
