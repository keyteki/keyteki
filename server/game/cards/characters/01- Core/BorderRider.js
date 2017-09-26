const DrawCard = require('../../../drawcard.js');

class BorderRider extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Ready this character',
            condition: () => this.bowed,
            handler: () => {
                this.addMessage('{0} readies {1} using its ability', this.controller, this);
                this.controller.readyCard(this);
            }
        });
    }
}

BorderRider.code = '01112';

module.exports = BorderRider;


