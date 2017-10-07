const ProvinceCard = require('../../provincecard.js');

class FertileFields extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Draw a card',
            clickToActivate: true,
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictProvince === this,
            handler: () => {
                this.game.addMessage('{0} uses {1} to draw a card', this.controller, this);
                this.controller.drawCardsToHand(1);
            }
        });
    }
}

FertileFields.id = 'fertile-fields';

module.exports = FertileFields;
