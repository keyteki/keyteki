const ProvinceCard = require('../../provincecard.js');

class TearsOfAmaterasu extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onProvinceRevealed: event => event.province === this
            },
            target: {
                ringCondition: ring => !ring.claimed && !ring.contested,
                mode: 'ring'
            },
            source: this,
            handler: context => {
                this.game.addMessage('{0} uses {1} to change the ring to {2}', this.controller, this, context.target.element);
                this.game.currentConflict.switchElement(context.target.element);
            }
        });
    }
}

TearsOfAmaterasu.id = 'tears-of-amaterasu';

module.exports = TearsOfAmaterasu;
