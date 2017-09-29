const DrawCard = require('../../drawcard.js');

class BorderRider extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Ready this character',
            condition: () => this.bowed,
            handler: () => {
                this.game.addMessage('{0} readies {1} using its ability', this.controller, this);
                this.controller.readyCard(this);
            }
        });
    }
}

BorderRider.id = 'border-rider';

module.exports = BorderRider;


